import { useEffect, useMemo, useRef, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  LargeTitle,
  Box,
  Title1,
  Faqs,
  Carousel,
  Button,
} from '@whosaidtrue/ui';
import { logout, selectIsGuest } from '../../features';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import GameVersions from '../../features/game-versions/GameVersions';
import JoinGame from '../../features/join-game/JoinGame';
import SetUpGame from '../../features/setup-game/SetupGame';
import { ReactComponent as Logo } from '../../assets/logo.svg';

// TODO: remove and replace
type UserStory = {
  lines: string[];
};

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const isGuest = useAppSelector(selectIsGuest);
  const playRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if any guest users get here, log them out
    if (isGuest) {
      dispatch(logout());
    }
  }, [dispatch, isGuest, history]);

  const handleLetsPlayClick = (event: MouseEvent) => {
    const { current } = playRef;

    if (current && !current.contains(event.target as Node)) {
      const { offsetTop } = current;

      window.scroll({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // TODO: remove and replace
  const tempStories = [
    {
      lines: [
        '"True or False, I have been to a strip club in the last 5 years?"',
        '"Did you say, \'in the last five years\'?"',
        '"Would that matter?! You\'re 17 years old"',
      ],
    },
    {
      lines: ['"True or False, this is a test story?"', '"True...very true"'],
    },
  ];

  // TODO: remove and replace
  const helper = (stories: UserStory[]) =>
    stories.map((story, i) => {
      return (
        <div key={i}>
          {story.lines.map((line, j) => (
            <p key={j}>{line}</p>
          ))}
        </div>
      );
    });

  return (
    <div className="container mx-auto px-4">
      <div className="block max-w-xs mb-10 mx-auto">
        <Logo className="w-full h-full" />
      </div>

      <div className="max-w-2xl text-center mb-10 mx-auto">
        <span className="text-yellow-base text-title-1 font-extrabold">
          The outrageously fun game of quirky questions and anonymous answers
        </span>
      </div>

      <div
        className="grid grid-cols-1 gap-6 max-w-6xl mb-6 mx-auto lg:grid-cols-2 lg:gap-10"
        ref={playRef}
      >
        <Box boxstyle="white" className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-repeat opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('./assets/bg.svg')",
              backgroundSize: '40%',
            }}
          ></div>
          <JoinGame />
        </Box>
        <Box boxstyle="white" className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-repeat opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('./assets/bg.svg')",
              backgroundSize: '40%',
            }}
          ></div>
          <SetUpGame />
        </Box>
      </div>

      <div className="max-w-3xl mb-20 mx-auto">
        <Carousel title={'Overheard on Who said true?'}>
          {helper(tempStories)}
        </Carousel>
      </div>

      <div className="max-w-full mb-20 mx-auto">
        <GameVersions onLetsPlayClick={handleLetsPlayClick} />
      </div>

      <div className="max-w-3xl mb-10 mx-auto lg:mb-20">
        <Faqs />
      </div>

      <div className="max-w-6xl mb-6 mx-auto">
        <div className="bg-basic-black bg-opacity-75 rounded-3xl p-6 text-center flex flex-col items-center lg:p-10">
          <h2 className="text-yellow-base text-title-1 font-extrabold mb-4 lg:text-large-title lg:mb-8">
            What are you Waiting For?!
          </h2>
          <Button onClick={handleLetsPlayClick}>Let's Play</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
