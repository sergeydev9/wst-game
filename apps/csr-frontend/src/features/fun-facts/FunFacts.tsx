import { FactsCarousel, MostSimilar, GroupComparison, NoOneSimilar } from '@whosaidtrue/ui';
import { useAppSelector } from "../../app/hooks";
import { selectTotalQuestions } from '../game/gameSlice';
import { selectBucketList, selectGroupVworld, selectMostSimilarPlayer, selectMostSimilarInGroup } from './funFactsSlice';


const FunFacts: React.FC = () => {
    const totalQuestions = useAppSelector(selectTotalQuestions);
    const bucketList = useAppSelector(selectBucketList);
    const groupVworld = useAppSelector(selectGroupVworld);
    const mostSimilarToPlayer = useAppSelector(selectMostSimilarPlayer);
    const mostSimilarInGroup = useAppSelector(selectMostSimilarInGroup);

    const shouldShow = (
        bucketList.textForGuess ||
        groupVworld.textForGuess ||
        mostSimilarToPlayer.numSameAnswer ||
        mostSimilarInGroup.numSameAnswer
    );

    const helper = () => {
        const result = [];
        let count = 0;
        if (bucketList.textForGuess) {
            result.push(
                <GroupComparison
                    isBucketList={true}
                    key={count}
                    questionText={bucketList.textForGuess}
                    globalPercentage={(
                        bucketList.globalTrue === 0 ?
                            bucketList.groupTrue :
                            bucketList.globalTrue
                    )}
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
                    globalPercentage={(
                        groupVworld.globalTrue === 0 ?
                            groupVworld.groupTrue :
                            groupVworld.globalTrue
                    )}
                    groupPercentage={groupVworld.groupTrue} />
            )
            count++;
        }

        if (mostSimilarToPlayer.numSameAnswer) {
            result.push(
                <MostSimilar
                    groupWide={false}
                    key={count}
                    totalQuestions={totalQuestions}
                    totalCommon={mostSimilarToPlayer.numSameAnswer}
                    heading={mostSimilarToPlayer.name}
                />
            )
            count++;
        } else {
            result.push(
                <NoOneSimilar />
            );
            count++;
        }

        if (mostSimilarInGroup.numSameAnswer) {
            result.push(
                <MostSimilar
                    groupWide={true}
                    key={count}
                    totalQuestions={totalQuestions}
                    totalCommon={mostSimilarInGroup.numSameAnswer}
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