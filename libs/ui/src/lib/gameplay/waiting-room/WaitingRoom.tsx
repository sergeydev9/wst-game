import GameContentCard from "../GameContentCard";
import GameCardFooter from '../GameCardFooter';
import WhileYouWereWaiting from "../../while-you-were-waiting/WhileYouWereWaiting";

export interface WaitingRoomProps {
    guessValue: number;
    questionText: string;
    totalPlayers: number;
    numberHaveGuessed: number
}
const WaitingRoom: React.FC<WaitingRoomProps> = ({ guessValue, questionText, totalPlayers, numberHaveGuessed }) => {
    return (
        <>
            <h2 className="text-basic-black font-black text-xl md:text-2xl text-center">You Guessed...</h2>
            <GameContentCard>
                <h1 className="text-basic-black font-black text-2xl md:text-3xl text-center">{guessValue > 0 ? guessValue : 'None'} of the players</h1>
                <h3 className="text-center md:text-2xl text-xl text-basic-black font-semibold">{questionText}</h3>
            </GameContentCard>
            <WhileYouWereWaiting />
            <GameCardFooter>
                {numberHaveGuessed} of {totalPlayers}  players have answered
            </GameCardFooter>
        </>
    )
}

export default WaitingRoom;