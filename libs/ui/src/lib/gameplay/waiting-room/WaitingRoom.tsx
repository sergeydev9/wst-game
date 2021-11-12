import GameContentCard from "../GameContentCard";
import GameCardFooter from '../GameCardFooter';

export interface WaitingRoomProps {
    guessValue: number;
    questionText: string;
    totalPlayers: number;
    numberHaveGuessed: number
}

/**
 * Waiting room page. This is shown when a player has submitted a guess and and an answer,
 * and is waiting for the other group members to submit their answers.
 *
 * The children prop should be the one liners component
 */
const WaitingRoom: React.FC<WaitingRoomProps> = ({ guessValue, questionText, totalPlayers, numberHaveGuessed, children }) => {
    return (
        <>
            <GameContentCard>
                <h2 className="text-basic-black font-black text-xl md:text-2xl text-center mb-4">You Guessed...</h2>
                <h1 className="text-basic-black font-black text-2xl md:text-3xl text-center">{guessValue > 0 ? guessValue : 'None'} of the players</h1>
                <h3 className="text-center md:text-2xl text-xl text-basic-black font-semibold">{questionText}</h3>
            </GameContentCard>
            {children}
            <GameCardFooter>
                {numberHaveGuessed} of {totalPlayers}  players have answered
            </GameCardFooter>
        </>
    )
}

export default WaitingRoom;