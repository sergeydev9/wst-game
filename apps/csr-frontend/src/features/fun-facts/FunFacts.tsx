import { FactsCarousel, MostSimilar, GroupComparison } from '@whosaidtrue/ui';
import { useAppSelector } from "../../app/hooks";
import { selectTotalQuestions } from '../game/gameSlice';
import { selectBucketList, selectGroupVworld, selectMostSimilarPlayer, selectMostSimilarInGroup } from './funFactsSlice';


const FunFacts: React.FC = () => {
    const totalQuestions = useAppSelector(selectTotalQuestions);
    const bucketList = useAppSelector(selectBucketList);
    const groupVworld = useAppSelector(selectGroupVworld);
    const mostSimilarToPlayer = useAppSelector(selectMostSimilarPlayer);
    const mostSimilarInGroup = useAppSelector(selectMostSimilarInGroup);


    return (
        <FactsCarousel>

            {/* Bucket List */}
            <GroupComparison
                isBucketList={true}
                questionText={bucketList.textForGuess}
                globalPercentage={bucketList.globalTrue}
                groupPercentage={bucketList.groupTrue} />

            {/* You group Vs the World */}
            <GroupComparison
                isBucketList={false}
                questionText={groupVworld.textForGuess}
                globalPercentage={groupVworld.globalTrue}
                groupPercentage={groupVworld.groupTrue} />

            {/* Most simiar to player */}
            <MostSimilar
                groupWide={false}
                totalQuestions={totalQuestions}
                totalCommon={mostSimilarToPlayer.numSameAnwser}
                heading={mostSimilarToPlayer.name}
            />

            {/* Most similar in group */}
            <MostSimilar
                groupWide={true}
                totalQuestions={totalQuestions}
                totalCommon={mostSimilarInGroup.numSameAnwser}
                heading={mostSimilarInGroup.names}
            />

        </FactsCarousel>
    )
}

export default FunFacts;