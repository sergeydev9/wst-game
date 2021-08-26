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
    <div className="grid grid-cols-6 gap-y-16 gap-x-8 items-center container mx-auto px-4 md:px-24">

      {/* logo group */}
      <Logo className="col-span-6 lg:col-span-2 row-span-1 lg:w-full lg:h-full" />
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


      {/* faq */}
      <div className="row-span-1 col-span-6 lg:col-span-4 lg:col-start-2 text-center flex flex-col gap-4 w-full justify-self-center">
        <LargeTitle className="text-true-white mb-8 ">Frequently Asked Questions</LargeTitle>
        <FaqCarousel question="How many questions are in a question deck?" answer="9" />
        <FaqCarousel question="Is Who said true appropriate for all ages?" answer="no" />
        <FaqCarousel question="How many licks does it take to get to the center of a tootsie pop?" answer="a lot..." />
      </div>


    </div>


  );
};

export default Home;