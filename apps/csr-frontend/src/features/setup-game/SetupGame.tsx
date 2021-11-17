import { Link } from 'react-router-dom';
import { Button, Title1 } from '@whosaidtrue/ui';

const SetUpGame: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center h-full w-full p-6 relative select-none">
      <Title1 className="mb-5" style={{ textShadow: '0 0 10px white' }}>
        Start a Game
      </Title1>
      <Button as={Link} to="/decks">
        Get Started!
      </Button>
    </section>
  );
};

export default SetUpGame;
