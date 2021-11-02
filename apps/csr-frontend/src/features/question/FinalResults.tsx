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
import { clearHost } from '../host/hostSlice';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RateApp from "../ratings/RateApp";
import FunFacts from '../fun-facts/FunFacts';
import RequestFreeCredit from "./RequestFreeCredit";

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
            <FunFacts />
            {!loggedIn && <RequestFreeCredit />}
            {loggedIn && !hasRatedApp && <RateApp />}
        </FinalScores>
    )
}

export default FinalResults;
