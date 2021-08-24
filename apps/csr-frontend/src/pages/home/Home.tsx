import React from "react";
import { LargeTitle, Box, Title1, FaqCarousel, Carousel } from "@whosaidtrue/ui";
import JoinGame from "../../features/join-game/JoinGame";
import SetUpGame from "../../features/setup-game/SetupGame";
import { ReactComponent as Logo } from '../../assets/logo.svg';

// TODO: Delete this and the dummy data when it's not needed anymore
type UserStory = {
  lines: string[]
}
const Home: React.FC = () => {

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
    <div className="flex flex-col gap-16 items-center container mx-auto md:px-32">

      {/* logo group */}
      <div className="flex flex-row place-items-center">
        <Logo className="flex-auto h-72 w-72" />
        <div className="flex flex-col gap-4 md:place-items-center text-center flex-auto">
          <LargeTitle className="text-true-white">Can you guess how many of your friends...</LargeTitle>
          <Box boxstyle='white' className="py-6 px-12" $dropShadow><Title1 className="text-purple-base">binge watched an entire season of a show in a weekend?</Title1></Box>
        </div>
      </div>

      {/* create/join game group */}
      <div className="flex flex-row gap-8 px-18 justify-center w-full">
        <Box boxstyle='white' className='w-1/2'>
          <JoinGame />
        </Box>
        <Box boxstyle='white' className='w-1/2'>
          <SetUpGame />
        </Box>
      </div>

      {/* overheard */}
      <div className="w-max">
        <Carousel title={'Overheard on Who said true?'}>
          {helper(tempStories)}
        </Carousel>
      </div>

      {/* faq */}
      <div className="flex flex-col gap-6">
        <LargeTitle className="text-true-white self-center">Frequently Asked Questions</LargeTitle>
        <FaqCarousel question="How many questions are in a question deck?" answer="9" />
        <FaqCarousel question="Is Who said true appropriate for all ages?" answer="no" />
        <FaqCarousel question="How many licks does it take to get to the center of a tootsie pop?" answer="a lot..." />
      </div>

    </div>


  );
};

export default Home;
