import { Link } from 'react-router-dom';
import { Button, Title1 } from '@whosaidtrue/ui';

const SetUpGame: React.FC = () => {
  return (
    <section className="text-center w-full self-stretch p-6 relative select-none">
      <Title1 className="mb-7">Start a Game</Title1>
      <div className="flex justify-center">
        <Button as={Link} to="/decks">
          Get Started!
        </Button>
      </div>
    </section>
  );
};

export default SetUpGame;
