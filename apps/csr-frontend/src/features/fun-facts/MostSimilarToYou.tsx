import {
    FactsCarousel,
    MostSimilar
} from '@whosaidtrue/ui';
import { useAppSelector } from "../../app/hooks";
import { selectTotalQuestions } from '../game/gameSlice';
import {
    selectMostSimilarPlayer
} from './funFactsSlice';


/**
 * Show player's "most similar to you stat. Only on the results for the 4th question"
 */
const MostSimilarToYou: React.FC = () => {
    const totalQuestions = useAppSelector(selectTotalQuestions);
    const mostSimilarToPlayer = useAppSelector(selectMostSimilarPlayer);
    const shouldShow = mostSimilarToPlayer.numSameAnswer;

    return (
        shouldShow ? <FactsCarousel>
            <MostSimilar
                groupWide={false}
                totalQuestions={totalQuestions}
                totalCommon={mostSimilarToPlayer.numSameAnswer}
                heading={mostSimilarToPlayer.name}
            />
        </FactsCarousel> : null
    )
}

export default MostSimilarToYou;