import QuestionCard from "../QuestionCard";
import WaitingRoomComponent from "./WaitingRoom";

export default {
    component: WaitingRoomComponent,
    title: 'Gameplay/Waiting Room'
}

export const WaitingRoom = () => (<QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment"><WaitingRoomComponent
    totalPlayers={7}
    numberHaveGuessed={3}
    guessValue={4}
    questionText="have binge watched an entire season of a show in a weekend." />
</QuestionCard>)