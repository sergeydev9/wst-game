import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, FinalScores, Scoreboard, } from "@whosaidtrue/ui";
import {
    clearCurrentQuestion,
    clearGame,
    isLoggedIn,
    selectHasRatedApp,
    selectPlayerScore,
    selectScoreboard,
    setFullModal,
    useSocket
} from "..";
import { clearHost } from '../host/hostSlice';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RateApp from "../ratings/RateApp";
import FunFacts from '../fun-facts/FunFacts';
import RequestFreeCredit from "./RequestFreeCredit";

const FinalResults: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { socket, setSocket } = useSocket();
    const scoreboard = useAppSelector(selectScoreboard);
    const playerScore = useAppSelector(selectPlayerScore);
    const loggedIn = useAppSelector(isLoggedIn);
    const hasRatedApp = useAppSelector(selectHasRatedApp);

    useEffect(() => {
        return () => {

            if (socket) {
                dispatch(clearGame());
                dispatch(clearCurrentQuestion());
                dispatch(clearHost());
                dispatch(setFullModal(''));
                socket.close() && setSocket(null);
            }
        }
    }, [socket, dispatch, setSocket])

    const handler = () => {
        history.push('/decks');
    }

    return (
        <FinalScores>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
            <FunFacts />
            {!loggedIn && <RequestFreeCredit />}
            {loggedIn && !hasRatedApp && <RateApp />}

            <div className="w-1/2 mx-auto">
                <Button type="button" ><Link to="/decks">Play Another Game</Link></Button>
            </div>
        </FinalScores>
    )
}

export default FinalResults;
