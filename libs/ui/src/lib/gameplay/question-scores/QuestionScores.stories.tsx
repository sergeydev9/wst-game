import QuestionResultsComponent from './QuestionScores';
import QuestionCard from '../QuestionCard';
import ScoreBoard, { PlayerScore } from '../scoreboard/Scoreboard';

export default {
    component: QuestionResultsComponent,
    title: 'Gameplay/Question Scores'
}

const scores: PlayerScore[] = [
    {
        rank: 1,
        points: 12000,
        name: 'Mystic racoon',
        rankDiff: 0
    },
    {
        rank: 2,
        points: 11000,
        name: 'Chuffed Caterpillarrrrrr',
        rankDiff: 2
    },
    {
        rank: 3,
        points: 10000,
        name: 'Massive Rodent',
        rankDiff: 0
    },
    {
        rank: 4,
        points: 9000,
        name: 'Psycho Giraffe',
        rankDiff: -2
    },
    {
        rank: 5,
        points: 8000,
        name: 'Angelic Nerd',
        rankDiff: 0
    }
]

export const WithoutTiedScores = () => (
    <QuestionCard totalQuestions={9} questionNumber={5} category="Entertainment">
        <QuestionResultsComponent guess={4} correctAnswer={3} pointsEarned={1250}>
            <ScoreBoard currentPlayerScore={{ rank: 8, name: 'The Hammer', points: 7000, rankDiff: 0 }} scores={scores} showDiff={true} />
        </QuestionResultsComponent>
    </QuestionCard>
)