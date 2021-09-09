export interface QuestionContentProps {
    text: string;
    headline: string;
}
const QuestionContent: React.FC<QuestionContentProps> = ({ text, headline }) => {
    return (
        <>
            <h2 className="text-2xl md:text-3xl text-center mb-2 font-black text-basic-black">{headline}</h2>
            <h3 className="text-center md:text-2xl text-xl text-basic-black mb-8 font-semibold">{text}</h3>
        </>
    )
}

export default QuestionContent;