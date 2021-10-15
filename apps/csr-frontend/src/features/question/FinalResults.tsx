import { FinalScores, Scoreboard, WinnerAnnouncement } from "@whosaidtrue/ui";
import { selectPlayerScore, selectScoreboard, selectShouldAnnounce, selectWinner } from "..";
import { useAppSelector } from "../../app/hooks";

const FinalResults: React.FC = () => {
    const scoreboard = useAppSelector(selectScoreboard);
    const playerScore = useAppSelector(selectPlayerScore);


    return (
        <FinalScores>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
        </FinalScores>
    )
}

export default FinalResults;
