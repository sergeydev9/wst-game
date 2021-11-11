import { useHistory, Link } from 'react-router-dom';
import { Title1, Button } from '@whosaidtrue/ui';

const SetUpGame: React.FC = () => {
  const history = useHistory();

  const handler = () => {
    history.push('/decks');
  };

  return (
    <section className="text-center w-full self-stretch p-6 relative select-none">
      <Title1 className="mb-7">Start a Game</Title1>
      <div className="flex justify-center">
        <Button type="button" onClick={handler}>
          {/* link is here in button so that web crawlers follow it and go to /decks */}
          <Link to="/decks">Get Started!</Link>
        </Button>
      </div>
    </section>
  );
};

export default SetUpGame;
