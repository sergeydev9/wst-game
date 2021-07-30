import React from "react";
import { HeroHeader, BoxedSpan, SectionHeader, UserStoryCarousel } from "@whosaidtrue/ui";
import JoinGame from "../../features/join-game/join-game";
import SetUpGame from "../../features/setup-game/SetupGame";

const Home: React.FC = () => {

  const tempStories = [
    {
      lines: ["\"True or False, I have been to a strip club in the last 5 years?\"", "\"Did you say, 'in the last five years'?\"", "\"Would that matter?! You're 17 years old\""]
    },
    {
      lines: ["\"True or False, this is a test story?\"", "\"True...very true\""]
    }
  ]
  return (
    <div className="flex flex-col items-center mt-12 gap-12">
      <HeroHeader>Can you guess how many of your friends...</HeroHeader>
      <BoxedSpan><SectionHeader>binge watched an entire season of a show in a weekend?</SectionHeader></BoxedSpan>
      <div className="flex flex-row gap-8">
        <BoxedSpan>
          <JoinGame />
        </BoxedSpan>
        <BoxedSpan>
          <SetUpGame />
        </BoxedSpan>
      </div>
      <UserStoryCarousel stories={tempStories} />
    </div>


  );
};

export default Home;
