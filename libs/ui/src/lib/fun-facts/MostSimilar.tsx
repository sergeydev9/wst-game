import Headline from './Headline';
import FactTitle from './FactTitle';
import FactText from './FactText';
import FactContainer from './FactContainer';

interface MostSimilarProps {
    groupWide: boolean; // if true, shows "most simiar players" instead of "most similar to you"
    totalQuestions: number;
    totalCommon: number;
    heading: string;
}

const MostSimilar: React.FC<MostSimilarProps> = ({ groupWide, totalQuestions, totalCommon, heading }) => {

    const text = (groupWide ?
        `They answered ${totalCommon} of ${totalQuestions} True/False questions the same way.` :
        `You and ${heading} answered ${totalCommon} of ${totalQuestions} True/False questions the same way`
    )

    return (
        <FactContainer>
            <FactTitle title={groupWide ? 'Most Similar Players' : 'Most Similar to You'} />
            <Headline>{heading}</Headline>
            <FactText>{text}</FactText>
        </FactContainer>

    )
}

export default MostSimilar;