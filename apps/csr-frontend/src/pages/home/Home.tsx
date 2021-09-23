import React from "react";
import { Link } from 'react-router-dom';
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

      {/* faq */}
      <div className="row-span-1 col-span-6 lg:col-span-4 lg:col-start-2 text-center flex flex-col gap-4 w-full justify-self-center">
        <LargeTitle className="text-true-white mb-8 ">Frequently Asked Questions</LargeTitle>
        <FaqCarousel question="How many questions are in a question deck?">
          Each Question Deck contains 9 questions. All players, regardless of group size, receive the same 9 questions.
        </FaqCarousel>
        <FaqCarousel question="How long does a game take?">
          Games usually take between 15 and 30 minutes depending on how many stories and conversation there is between each question.
        </FaqCarousel>
        <FaqCarousel question="Are my answers anonymous?">
          Well technically, yes, but if you’re only playing with one other person, it’s pretty easy to figure out how they answered.  But any group larger than 2 players is completely anonymous.
        </FaqCarousel>
        <FaqCarousel question="How are points awarded?">
          Points are awarded based on how close your guess of the number of people who answered 'True' is to how many actually answered 'True'.
          If you guess the number exactly, you earn 1,500 points.
          The further from the correct number the fewer points you earn. But remember;
          it's not really about the points - it's about the stories that come with the answers.
        </FaqCarousel>
        <FaqCarousel question="Is Who Said True appropriate for all ages? ">
          The Question Decks are intended for ages 13 to 113.
          Each Question Deck has a “Movie Rating” from PG to R. For a completely “clean” game experience, navigate over to <a href="www.whosaidtrueforschools.com" target="_blank" rel="" className="text-blue-base underline">“Who Said True for Schools”</a>
        </FaqCarousel>
        <FaqCarousel question="Can I see the questions?">
          It’s definitely more fun if you don’t know the questions ahead of time. If you’re really concerned about the questions, it’s best to play a test game with a trusted friend.
        </FaqCarousel>
        <FaqCarousel question="Are my answers anonymous?">
          Well technically, yes, but if you’re only playing with one other person, it’s pretty easy to figure out how they answered.  But any group larger than 2 players is completely anonymous.
        </FaqCarousel>
        <FaqCarousel question="Does each player need 2 devices to play on Zoom?">
          Here are a couple of ways to play Who Said True on Zoom from best to least good:
          <ul className="list-disc">
            <li>One computer (or laptop) and a second monitor - Have Zoom running on one monitor and play 9 Truths on the second monitor.
            </li>
            <li>One computer (or laptop) and a smartphone - Have Zoom running on the computer and play 9 Truths on your phone
            </li>
            <li>One computer (or laptop) - Have Zoom running in one browser tab and play 9 Truths in another browser tab
            </li>
            <li>One smartphone - Start the Zoom session and then open a browser and play 9 Truths.  This one is tougher because you can hear the audio, but you can't easily see people's faces
            </li>
          </ul>
        </FaqCarousel>
        <FaqCarousel question="How many people can play a game?">
          There is no limit to the number of people that can play in a game, but the bigger the group the fewer stories and conversations there will be about the questions/answers.
        </FaqCarousel>
        <FaqCarousel question="Is Who Said True available in other languages?">
          Not yet, but I’m working on adding additional languages. <Link className="text-blue-base underline" to="/contact-us">Contact me</Link> to vote for the language you want to be added.
        </FaqCarousel>
        <FaqCarousel question="Why do you need my email address?">
          After a game is over, you’ll receive a “Game Results” email which tells how your group compares to the rest of the world.
        </FaqCarousel>
        <FaqCarousel question="What happened to 9 Truths?">
          It grew up and blossomed into Who Said True
        </FaqCarousel>
      </div>
    </div>
  );
};

export default Home;