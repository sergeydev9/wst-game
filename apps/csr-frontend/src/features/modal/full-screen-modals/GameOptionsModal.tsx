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

    const domain = process.env.NX_IS_FOR_SCHOOLS === 'true' ? 'whosaidtrueforschools.com/game' : 'whosaidtrue.com/game';
    return (
        <ModalContent>
            <Title1 className="mt-1 mb-10">Game Options</Title1>
            <InviteLinks domain={domain} accessCode={accessCode}>

                {/* buttons */}
                {isHost ? <HostGameOptionsButtons /> :
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
                    >Leave Game</button>}

                {/* links */}
                <Headline
                    onClick={() => dispatch(setFullModal('submitQuestion'))}
                    className="text-purple-light underline text-center my-8 cursor-pointer">
                    Submit a Question
                </Headline>
                <Headline
                    onClick={() => dispatch(setFullModal('reportAnIssue'))}
                    className="text-purple-light underline text-center cursor-pointer my-8">Report an issue</Headline>
            </InviteLinks>
        </ModalContent>)
}

export default GameOptionsModal;