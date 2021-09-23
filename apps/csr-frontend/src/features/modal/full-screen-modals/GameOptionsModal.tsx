import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Title1, InviteLinks, Headline, ModalContent } from '@whosaidtrue/ui';
import { clearGame, selectAccessCode, selectIsHost } from '../../game/gameSlice';
import HostGameOptionsButtons from '../../host/HostGameOptionsButtons';
import { Link } from 'react-router-dom';
import { setFullModal } from '../modalSlice';

const GameOptionsModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const history = useHistory();
    const accessCode = useAppSelector(selectAccessCode)
    const isHost = useAppSelector(selectIsHost);

    const leaveGame = () => {
        dispatch(clearGame())
        history.push('/')
    }
    return (
        <ModalContent>
            <Title1 className="mt-1 mb-10">Game Options</Title1>
            <InviteLinks accessCode={accessCode}>
                {isHost ? <HostGameOptionsButtons /> :
                    <button
                        type="button"
                        onClick={leaveGame}
                        className="border-2 border-destructive text-destructive text-label-big bg-white-ish font-bold rounded-full py-4 w-full text-center hover:bg-destructive hover:text-white-ish"
                    >Leave Game</button>}
                <Headline onClick={() => dispatch(setFullModal(''))} className="text-purple-light underline text-center my-8"><Link to="/contact-us">Submit a Question</Link></Headline>
                <Headline onClick={() => dispatch(setFullModal('reportAnIssue'))} className="text-purple-light underline text-center cursor-pointer my-8">Report an issue</Headline>
            </InviteLinks>
        </ModalContent>)
}

export default GameOptionsModal;