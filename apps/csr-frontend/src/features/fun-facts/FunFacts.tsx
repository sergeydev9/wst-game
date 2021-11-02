import { FactsCarousel, MostSimilar, GroupComparison } from '@whosaidtrue/ui';
import { useAppSelector } from "../../app/hooks";
import { selectBucketList, selectGroupVworld } from './funFactsSlice';


const FunFacts: React.FC = () => {
    const bucketList = useAppSelector(selectBucketList);
    const groupVworld = useAppSelector(selectGroupVworld);


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

        </FactsCarousel>
    )
}

export default FunFacts;