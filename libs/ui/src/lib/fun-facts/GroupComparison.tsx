import FactTitle from './FactTitle';
import FactText from './FactText';
import FactContainer from './FactContainer';
import PercentagePie from '../gameplay/question-answers/PercentagePie';

interface GroupComparisonProps {
    isBucketList: boolean;
    questionText: string;
    groupPercentage: number;
    globalPercentage: number;
}

const GroupComparison: React.FC<GroupComparisonProps> = ({ isBucketList, questionText, groupPercentage, globalPercentage }) => {
    return (
        <FactContainer>
            <FactTitle title={isBucketList ? 'Bucket List Challenge' : 'Your Group vs. The World'} />
            <FactText>"{questionText}"</FactText>

            {/* pie charts */}
            <div className="w-full flex sm:gap-6 gap-4 mt-3 justify-center items-center">
                <PercentagePie isGroup={true} value={groupPercentage} />
                <PercentagePie isGroup={false} value={globalPercentage} />
            </div>



        </FactContainer>
    )
}

export default GroupComparison;