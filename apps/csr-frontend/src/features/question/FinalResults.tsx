import { FinalScores, Scoreboard, } from "@whosaidtrue/ui";
import { isLoggedIn, selectHasRatedApp, selectPlayerScore, selectScoreboard } from "..";
import { useAppSelector } from "../../app/hooks";
import RateApp from "../ratings/RateApp";
import RequestFreeCredit from "./RequestFreeCredit";

const FinalResults: React.FC = () => {
    const scoreboard = useAppSelector(selectScoreboard);
    const playerScore = useAppSelector(selectPlayerScore);
    const loggedIn = useAppSelector(isLoggedIn);
    const hasRatedApp = useAppSelector(selectHasRatedApp);


    return (
        <FinalScores>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
            {!loggedIn && <RequestFreeCredit />}
            {loggedIn && !hasRatedApp && <RateApp />}
        </FinalScores>
    )
}

export default FinalResults;
