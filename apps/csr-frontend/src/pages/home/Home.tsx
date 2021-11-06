import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { LargeTitle, Box, Title1, Faqs, Carousel } from "@whosaidtrue/ui";
import { logout, selectIsGuest } from '../../features';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import JoinGame from "../../features/join-game/JoinGame";
import SetUpGame from "../../features/setup-game/SetupGame";
import { ReactComponent as Logo } from '../../assets/logo.svg';

type UserStory = {
  lines: string[]
}
const Home: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const isGuest = useAppSelector(selectIsGuest);

  useEffect(() => {
    // if any guest users get here, log them out
    if (isGuest) {
      dispatch(logout())
    }
  }, [dispatch, isGuest, history])

  const tempStories = [
    {
      lines: ["\"True or False, I have been to a strip club in the last 5 years?\"", "\"Did you say, 'in the last five years'?\"", "\"Would that matter?! You're 17 years old\""]
    },
    {
      lines: ["\"True or False, this is a test story?\"", "\"True...very true\""]
    }
  ]
  const helper = (stories: UserStory[]) => stories.map((story, i) => {
    return (
      <div key={i}>
        {story.lines.map((line, j) => <p key={j}>{line}</p>)}
      </div>
    )
  })
  return (
    <div className="grid grid-cols-6 gap-y-16 gap-x-8 items-center container mx-auto px-4 md:px-24">

      {/* logo group */}
      <Logo className="col-span-6 lg:col-span-2 row-span-1 w-full h-full" />
      <div className="row-span-1 col-span-6 lg:col-span-4 text-center">
        <LargeTitle className="text-true-white mb-8">Can you guess how many of your friends...</LargeTitle>
        <Box boxstyle='white' className="py-6 px-12" $dropShadow><Title1 className="text-purple-base">binge watched an entire season of a show in a weekend?</Title1></Box>
      </div>


      {/* create/join game group */}
      <Box boxstyle='white' className="row-span-1 col-span-6 lg:col-span-3">
        <JoinGame />
      </Box>
      <Box boxstyle='white' className="row-span-1 col-span-6 lg:col-span-3">
        <SetUpGame />
      </Box>

      {/* overheard */}
      <div className="row-span-1 col-span-6  lg:col-span-4 lg:col-start-2">
        <Carousel title={'Overheard on Who said true?'}>
          {helper(tempStories)}
        </Carousel>
      </div>
      <Faqs />
    </div>

  );
};

export default Home;