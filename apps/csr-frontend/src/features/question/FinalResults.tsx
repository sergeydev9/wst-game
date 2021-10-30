import { useEffect } from 'react';
import { FinalScores, Scoreboard, } from "@whosaidtrue/ui";
import {
    clearCurrentQuestion,
    clearGame,
    isLoggedIn,
    selectHasRatedApp,
    selectPlayerScore,
    selectScoreboard,
    useSocket
} from "..";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RateApp from "../ratings/RateApp";
import RequestFreeCredit from "./RequestFreeCredit";
import { clearHost } from '../host/hostSlice';

const FinalResults: React.FC = () => {
    const dispatch = useAppDispatch();
    const { socket, setSocket, setShouldBlock } = useSocket();
    const scoreboard = useAppSelector(selectScoreboard);
    const playerScore = useAppSelector(selectPlayerScore);
    const loggedIn = useAppSelector(isLoggedIn);
    const hasRatedApp = useAppSelector(selectHasRatedApp);

    useEffect(() => {

        return () => {
            dispatch(clearGame());
            dispatch(clearCurrentQuestion());
            dispatch(clearHost());
            setShouldBlock(false);
            socket && socket.close() && setSocket(null);
        }
    })

    return (
        <FinalScores>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
            {!loggedIn && <RequestFreeCredit />}
            {loggedIn && !hasRatedApp && <RateApp />}
        </FinalScores>
    )
}

export default FinalResults;
