import { ScoreboardEntry } from '@whosaidtrue/app-interfaces';
import QuestionResultsComponent from './QuestionScores';
import QuestionCard from '../QuestionCard';
import ScoreBoard from '../scoreboard/Scoreboard';

export default {
  component: QuestionResultsComponent,
  title: 'Gameplay/Question Scores',
};

const scoresWithTies: ScoreboardEntry[] = [
  {
    rank: 1,
    score: 12000,
    player_name: 'Mystic racoon',
    rankDifference: 0,
  },
  {
    rank: 2,
    score: 11000,
    player_name: 'Chuffed Caterpillarrrrrr',
    rankDifference: 2,
  },
  {
    rank: 3,
    score: 10000,
    player_name: 'Massive Rodent',
    rankDifference: 0,
  },
  {
    rank: 4,
    score: 9000,
    player_name: 'Psycho Giraffe',
    rankDifference: -2,
  },
  {
    rank: 5,
    score: 8500,
    player_name: 'Elegant Shtern',
    rankDifference: 0,
  },
  {
    rank: 5,
    score: 8500,
    player_name: 'Boring Brown',
    rankDifference: 0,
  },
  {
    rank: 6,
    score: 7500,
    player_name: 'The Hammer',
    rankDifference: 0,
  },
  {
    rank: 7,
    score: 6000,
    player_name: 'Angelic Nerd',
    rankDifference: 0,
  },
];

const scoresWithoutTies: ScoreboardEntry[] = [
  {
    rank: 1,
    score: 12000,
    player_name: 'Mystic racoon',
    rankDifference: 0,
  },
  {
    rank: 2,
    score: 11000,
    player_name: 'Chuffed Caterpillarrrrrr',
    rankDifference: 2,
  },
  {
    rank: 3,
    score: 10000,
    player_name: 'Massive Rodent',
    rankDifference: 0,
  },
  {
    rank: 4,
    score: 9000,
    player_name: 'Psycho Giraffe',
    rankDifference: -2,
  },
  {
    rank: 5,
    score: 8500,
    player_name: 'The Hammer',
    rankDifference: 0,
  },
  {
    rank: 6,
    score: 8000,
    player_name: 'Angelic Nerd',
    rankDifference: 0,
  },
];

export const WithTiedScores = () => (
  <QuestionCard totalQuestions={9} questionNumber={5} category="Entertainment">
    <QuestionResultsComponent
      hasGuessed={true}
      guess="4"
      correctAnswer="3"
      pointsEarned={1250}
    >
      <ScoreBoard
        currentPlayerScore={{
          rank: 6,
          player_name: 'The Hammer',
          score: 7500,
          rankDifference: 0,
        }}
        scores={scoresWithTies}
      />
    </QuestionResultsComponent>
  </QuestionCard>
);

export const WithoutTiedScores = () => (
  <QuestionCard totalQuestions={9} questionNumber={5} category="Entertainment">
    <QuestionResultsComponent
      hasGuessed={true}
      guess="4"
      correctAnswer="3"
      pointsEarned={1250}
    >
      <ScoreBoard
        currentPlayerScore={{
          rank: 5,
          player_name: 'The Hammer',
          score: 8500,
          rankDifference: 0,
        }}
        scores={scoresWithoutTies}
      />
    </QuestionResultsComponent>
  </QuestionCard>
);
