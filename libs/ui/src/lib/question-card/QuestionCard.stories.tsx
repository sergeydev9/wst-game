import QuestionCard from './QuestionCard';

export default {
    component: QuestionCard,
    title: 'Cards/Question'
}

export const Question = () => <QuestionCard questionNumber={1} totalQuestions={10} category="Entertainment" />