import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Title1, InviteLinks, Headline, ModalContent } from '@whosaidtrue/ui';
import { clearGame, selectAccessCode, selectIsHost } from '../../game/gameSlice';
import HostGameOptionsButtons from '../../host/HostGameOptionsButtons';
import { setFullModal } from '../modalSlice';
import { clearCurrentQuestion } from '../../question/questionSlice';
import { useSocket } from '../..';

const GameOptionsModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const history = useHistory();
    const { setShouldBlock } = useSocket();
    const accessCode = useAppSelector(selectAccessCode)
    const isHost = useAppSelector(selectIsHost);

    const leaveGame = () => {
        setShouldBlock(false);
        dispatch(clearGame());
        dispatch(clearCurrentQuestion());
        dispatch(setFullModal(''));
        history.push('/');
    }

    const domain = `${process.env.NX_DOMAIN}/game`;
    return (
        <ModalContent $narrow>
          <div>
            <Title1 className="mt-1 mb-6 text-center">Game Options</Title1>
            <InviteLinks domain={domain} accessCode={accessCode}>

                {/* buttons */}
                {isHost ? <HostGameOptionsButtons /> :
                    <div className="flex flex-col gap-4 px-6 mb-6">
                        <button
                            type="button"
                            onClick={leaveGame}
                            className={`
                                border-2
                                border-destructive
                                text-destructive
                                text-label-big
                                bg-white-ish
                                font-bold
                                rounded-full
                                py-4 w-full
                                text-center
                                hover:bg-destructive
                                hover:text-white-ish
                            `}
                        >Leave Game</button>
                    </div>
                  }

                {/* links */}
                <div className="flex flex-col space-y-6">
                  <button
                      className="font-bold text-basic-black text-headline underline"
                      onClick={() => dispatch(setFullModal('submitQuestion'))}>
                      Submit a Question
                  </button>
                  <button
                      className="font-bold text-basic-black text-headline underline"
                      onClick={() => dispatch(setFullModal('reportAnIssue'))}>Report an Issue</button>
                </div>
            </InviteLinks>
          </div>
        </ModalContent>)
}

export default GameOptionsModal;
