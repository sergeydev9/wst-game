import tw from 'tailwind-styled-components';

const Container = tw.div`
    bg-green-subtle-fill
    border
    rounded-3xl
    mx-auto
    p-4
    border-green-subtle-stroke
    flex
    flex-row
    gap-4
    text-green-base
    justify-around
    w-full
    sm:w-max
`;

const SmallHeader = tw.h3`
    text-lg
    font-bold
    text-center
`;

const MediumHeader = tw.h2`
    text-xl
    font-bold
    text-center
`;

interface GuessAndValueProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  guess: string;
  correctAnswer: string;
  showPercent?: boolean;
  hasGuessed: boolean;
}

/**
 * Displays a green box that contains the correct answer, and the answer given
 * by the player.
 *
 * If `hasGuessed` is false, doesn't show the guess.
 *
 * Setting `showPercent` to true changes the grammar so that it is apporpriate
 * for values expressed as percentages.
 */
const GuessAndValue: React.FC<GuessAndValueProps> = ({
  guess,
  correctAnswer,
  showPercent,
  hasGuessed,
  ...rest
}) => {
  return (
    <Container {...rest}>
      {hasGuessed && (
        <div>
          <MediumHeader>You Guessed</MediumHeader>
          <SmallHeader>
            {guess}{' '}
            {guess === '1' ? 'player' : showPercent ? 'of players' : 'players'}
          </SmallHeader>
        </div>
      )}
      <div>
        <MediumHeader>Correct Answer</MediumHeader>
        <SmallHeader>
          {correctAnswer === '1'
            ? `${correctAnswer} player`
            : `${correctAnswer} ${showPercent ? 'of players' : 'players'}`}
        </SmallHeader>
      </div>
    </Container>
  );
};

export default GuessAndValue;
