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

    const shouldShow = bucketList.textForGuess || groupVworld.textForGuess || mostSimilarToPlayer.numSameAnwser || mostSimilarInGroup.numSameAnwser;

    const helper = () => {
        const result = [];
        let count = 0;
        if (bucketList.textForGuess) {
            result.push(
                <GroupComparison
                    isBucketList={true}
                    key={count}
                    questionText={bucketList.textForGuess}
                    globalPercentage={bucketList.globalTrue}
                    groupPercentage={bucketList.groupTrue} />
            )
            count++;
        }

        if (groupVworld.textForGuess) {
            result.push(
                <GroupComparison
                    isBucketList={false}
                    key={count}
                    questionText={groupVworld.textForGuess}
                    globalPercentage={groupVworld.globalTrue}
                    groupPercentage={groupVworld.groupTrue} />
            )
            count++;
        }

        if (mostSimilarToPlayer.numSameAnwser) {
            result.push(
                <MostSimilar
                    groupWide={false}
                    key={count}
                    totalQuestions={totalQuestions}
                    totalCommon={mostSimilarToPlayer.numSameAnwser}
                    heading={mostSimilarToPlayer.name}
                />
            )
            count++;
        }

        if (mostSimilarInGroup.numSameAnwser) {
            result.push(
                <MostSimilar
                    groupWide={true}
                    key={count}
                    totalQuestions={totalQuestions}
                    totalCommon={mostSimilarInGroup.numSameAnwser}
                    heading={mostSimilarInGroup.names}
                />
            )
            count++;
        }

        return result;
    }


    return (
        shouldShow ? <FactsCarousel>
            {helper()}
        </FactsCarousel> : null
    )
}

export default FunFacts;