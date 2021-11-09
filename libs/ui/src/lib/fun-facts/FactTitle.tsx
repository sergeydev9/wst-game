import tw from "tailwind-styled-components";

interface FactTitleProps {
    title: string
}

const Container = tw.div`
    w-full
    block
    text-center
    leading-tight
`

const FunFact = tw.h4`
    text-basic-black
    font-bold
    text-sm
`

const Title = tw.h3`
    text-basic-black
    font-black
    text-xl
`

const FactTitle: React.FC<FactTitleProps> = ({ title }) => {

    return (
        <Container>
            <FunFact>Fun Fact</FunFact>
            <Title>{title}</Title>
        </Container>
    )
}

export default FactTitle;