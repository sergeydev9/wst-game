import Headline from './Headline';
import FactTitle from './FactTitle';
import FactText from './FactText';
import FactContainer from './FactContainer';


const NoOneSimilar: React.FC = () => {


    return (
        <FactContainer>
            <FactTitle title="Most Similar To Your" />
            <Headline>Nobody</Headline>
            <FactText>Your True/False answers didn't match anyone else. You're one of a kind</FactText>
        </FactContainer>

    )
}

export default NoOneSimilar;