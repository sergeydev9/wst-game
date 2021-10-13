import { useAppSelector } from '../../app/hooks';
import { Lobby, selectIsHost, selectPlayerStatus, HostActions, selectGameStatus, Question } from '../../features';

const Play: React.FC = () => {
    const playerStatus = useAppSelector(selectPlayerStatus);
    const isHost = useAppSelector(selectIsHost);
    const gameStatus = useAppSelector(selectGameStatus);

    return (
        <>
            {playerStatus === "lobby" && <Lobby />}
            {playerStatus === 'inGame' && gameStatus === 'inProgress' && <Question />}
            {isHost && <HostActions />}
        </>
    )
}

export default Play