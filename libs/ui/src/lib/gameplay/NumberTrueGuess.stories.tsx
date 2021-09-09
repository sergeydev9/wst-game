import QuestionCard from './QuestionCard';
import NumberTrueGuessComponent from './NumberTrueGuess';

export default {
    component: NumberTrueGuessComponent,
    title: 'Gameplay/Number True Guess'
}

export const NumberTrueGuess = () => (
    <QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment" >
        <NumberTrueGuessComponent submitHandler={(v) => null} questionText="“I’ve binge watched an entire season of a show in a weekend.”"></NumberTrueGuessComponent>
    </QuestionCard>)