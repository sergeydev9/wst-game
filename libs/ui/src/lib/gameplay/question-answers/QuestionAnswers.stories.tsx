import { Story, Meta } from '@storybook/react';
import QuestionAnswersComponent, { QuestionAnswersProps } from './QuestionAnswers';
import QuestionCard from '../QuestionCard';
import SubmitRating from '../../submit-rating/SubmitRating';
import { UserRating } from '@whosaidtrue/app-interfaces';

export default {
    component: QuestionAnswersComponent,
    title: 'Gameplay/Question Answers',
    argTypes: {
        globalTruePercent: {
            control: { type: 'range', min: 0, max: 100, step: 1 }
        },
        groupTruePercent: {
            control: { type: 'range', min: 0, max: 100, step: 1 }
        }
    }
} as Meta;


export const QuestionAnswers: Story<QuestionAnswersProps> = (args) => (
    <QuestionCard totalQuestions={9} questionNumber={5} category="Entertainment">
        <QuestionAnswersComponent {...args} >
            <SubmitRating submitRatingHandler={(v: UserRating) => console.log(v)} />
        </QuestionAnswersComponent>

    </QuestionCard>
)

QuestionAnswers.args = {
    correctAnswer: 3,
    questionText: "have binge watched an entire season of a show in a weekend.",
    followUp: "What was the show?\nWhere did you come from?",
    globalTruePercent: 75,
    groupTruePercent: 50,
}