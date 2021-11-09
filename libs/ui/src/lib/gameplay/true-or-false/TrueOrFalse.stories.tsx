import QuestionCard from '../QuestionCard';
import TrueOrFalseBox from './TrueOrFalseBox';

export default {
    component: TrueOrFalseBox,
    title: 'Gameplay/True or False'
}

export const IsReader = () => (
    <QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment" >
        <TrueOrFalseBox hasPasses={true} isReader={true} submitHandler={(v) => null} text="“You have binge watched an entire season of a show in a weekend.”"></TrueOrFalseBox>
    </QuestionCard>)

export const IsNotReader = () => (
    <QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment" >
        <TrueOrFalseBox hasPasses={true} isReader={false} submitHandler={(v) => null} text="“You have binge watched an entire season of a show in a weekend.”"></TrueOrFalseBox>
    </QuestionCard>)

export const NoPasses = () => (
    <QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment" >
        <TrueOrFalseBox hasPasses={false} isReader={true} submitHandler={(v) => null} text="“You have binge watched an entire season of a show in a weekend.”"></TrueOrFalseBox>
    </QuestionCard>)
