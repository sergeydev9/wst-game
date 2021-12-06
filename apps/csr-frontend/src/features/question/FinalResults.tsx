import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FinalScores, Scoreboard, GuessAndValue, PointsEarned } from "@whosaidtrue/ui";
import {
    clearCurrentQuestion,
    clearGame,
    isLoggedIn,
    selectHasRatedApp,
    setFullModal,
    useSocket
} from "..";
import {
    selectCorrectAnswer,
    selectGuessValue,
    selectPlayerScore,
    selectScoreboard,
    selectNumPlayers,
    selectHasGuessed,
    selectGroupTrue,
    selectPlayerPointsEarned
} from "./questionSlice";
import { clearHost } from '../host/hostSlice';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RateApp from "../ratings/RateApp";
import FunFacts from '../fun-facts/FunFacts';
import RequestFreeCredit from "./RequestFreeCredit";
import { guessAsPercentage } from "../../util/functions";


/**
 * Final results for a game
 */
const FinalResults: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { socket, setSocket } = useSocket();
    const scoreboard = useAppSelector(selectScoreboard);
    const playerScore = useAppSelector(selectPlayerScore);
    const loggedIn = useAppSelector(isLoggedIn);
    const hasRatedApp = useAppSelector(selectHasRatedApp);
    const totalPlayers = useAppSelector(selectNumPlayers);
    const correctAnswer = useAppSelector(selectCorrectAnswer);
    const guess = useAppSelector(selectGuessValue);
    const hasGuessed = useAppSelector(selectHasGuessed);
    const groupTrue = useAppSelector(selectGroupTrue);
    const points = useAppSelector(selectPlayerPointsEarned);

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
            <GuessAndValue
                className="mb-8"
                guess={totalPlayers > 10 ? guessAsPercentage(guess, totalPlayers) : `${guess}`}
                correctAnswer={totalPlayers > 10 ? `${Math.round(groupTrue)}%` : `${correctAnswer}`}
                showPercent={totalPlayers > 10}
                hasGuessed={hasGuessed} />

            {/* Points Earned */}
            {points || points === 0 ? <PointsEarned points={points} /> : null}
            <FunFacts />
            <div className="mb-8"></div>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
            {!loggedIn && <RequestFreeCredit />}
            {loggedIn && !hasRatedApp && <RateApp />}
            <div className="mx-auto mt-10 text-center w-full">
                <Button type="button" onClick={handler}>Play Another Game</Button>
            </div>
        </FinalScores>
    )
}

export default FinalResults;
