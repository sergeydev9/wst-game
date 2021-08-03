import React from "react";
import { LargeTitle, Box, Title1, Title3, Carousel } from "@whosaidtrue/ui";
import JoinGame from "../../features/join-game/join-game";
import SetUpGame from "../../features/setup-game/SetupGame";

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
  const title = <Title3>Placeholder</Title3>
  return (
    <div className="flex flex-col items-center mt-12 gap-12">
      <LargeTitle>Can you guess how many of your friends...</LargeTitle>
      <Box><Title1>binge watched an entire season of a show in a weekend?</Title1></Box>
      <div className="flex flex-row gap-8">
        <Box>
          <JoinGame />
        </Box>
        <Box>
          <SetUpGame />
        </Box>
      </div>
      <Carousel title={title}>
        {helper(tempStories)}
      </Carousel>
    </div>


  );
};

export default Home;
