import tw from 'tailwind-styled-components';
import GameCardFooter from '../GameCardFooter';
import PointsEarned from '../points-earned/PointsEarned';
import GuessAndValue from '../../guess-and-value/GuessAndValue';
import { Box } from '../../../index';

const ScoreboardHeader = tw.h2`
    text-center
    font-bold
    text-basic-black
    text-2xl
`;

const MediumHeader = tw.h2`
text-xl
font-bold
text-center
`;

export interface QuestionResultsProps {
  question: string;
  guess: string;
  correctAnswer: string;
  pointsEarned?: number;
  showPercent?: boolean;
  hasGuessed: boolean; // if user passed. If user passed, guess value will be 0, so another prop is needed
  funFactsComponent?: React.ReactElement | null;
}
const QuestionResults: React.FC<QuestionResultsProps> = ({
  question,
  guess,
  showPercent,
  correctAnswer,
  pointsEarned,
  children,
  hasGuessed,
  funFactsComponent,
}) => {
  return (
    <>
      <Box
        boxstyle="purple-subtle"
        className="filter drop-shadow-card-container p-4"
      >
        <MediumHeader>True or False</MediumHeader>
        <p className="font-normal text-lg">{question}</p>
      </Box>
      {/* Guess and Value */}
      <GuessAndValue
        guess={guess}
        showPercent={showPercent}
        correctAnswer={correctAnswer}
        hasGuessed={hasGuessed}
      />

      {/* Points Earned */}
      {pointsEarned || pointsEarned === 0 ? (
        <PointsEarned points={pointsEarned} />
      ) : null}

      {/* fun facts */}
      {funFactsComponent && funFactsComponent}

      {/* Scoreboard */}
      <ScoreboardHeader>Scoreboard</ScoreboardHeader>
      {children}
      <GameCardFooter>The host will advance the game</GameCardFooter>
    </>
  );
};

export default QuestionResults;
