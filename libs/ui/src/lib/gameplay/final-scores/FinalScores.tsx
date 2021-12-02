import NoFlexBox from '../../containers/no-flex-box/NoFlexBox'

const FinalScores: React.FC = ({ children }) => {
    return (
        <NoFlexBox className="w-full sm:w-40rem mx-auto">
            <h1 className="font-black text-4xl text-center mb-6">The Final Scores</h1>
            {children}
        </NoFlexBox>
    )
}

export default FinalScores;