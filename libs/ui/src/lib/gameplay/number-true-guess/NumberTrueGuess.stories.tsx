import QuestionCard from '../QuestionCard';
import NumberTrueGuessComponent from './NumberTrueGuess';

export default {
    component: NumberTrueGuessComponent,
    title: 'Gameplay/Number True Guess'
}

export const NumberTrueGuess = () => (
    <QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment" >
        <NumberTrueGuessComponent
            totalPlayers={7}
            submitHandler={(v) => console.log(v)}
            questionText="“I’ve binge watched an entire season of a show in a weekend.”" />
    </QuestionCard>)