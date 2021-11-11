import { Link } from 'react-router-dom';
import FaqItem from './FaqItem';

const Faqs: React.FC = () => {
  return (
    <div className="row-span-1 col-span-6 lg:col-span-4 lg:col-start-2 text-center flex flex-col gap-4 w-full justify-self-center">
      <div className="text-yellow-base text-large-title font-extrabold mb-8">
        Frequently Asked Questions
      </div>
      <FaqItem question="How many questions are in a question deck?">
        Each Question Deck contains 9 questions. All players, regardless of
        group size, receive the same 9 questions.
      </FaqItem>
      <FaqItem question="How long does a game take?">
        Games usually take between 15 and 30 minutes depending on how many
        stories and conversation there is between each question.
      </FaqItem>
      <FaqItem question="How are points awarded?">
        Points are awarded based on how close your guess of the number of people
        who answered 'True' is to how many actually answered 'True'. If you
        guess the number exactly, you earn 1,500 points. The further from the
        correct number the fewer points you earn. But remember; it's not really
        about the points - it's about the stories that come with the answers.
      </FaqItem>
      <FaqItem question="Is Who Said True appropriate for all ages? ">
        The Question Decks are intended for ages 13 to 113. Each Question Deck
        has a “Movie Rating” from PG to R. For a completely “clean” game
        experience, navigate over to{' '}
        <a
          href="http://www.whosaidtrueforschools.com"
          className="text-blue-base underline"
        >
          “Who Said True for Schools”
        </a>
      </FaqItem>
      <FaqItem question="Can I see the questions?">
        It’s definitely more fun if you don’t know the questions ahead of time.
        If you’re really concerned about the questions, it’s best to play a test
        game with a trusted friend.
      </FaqItem>
      <FaqItem question="Are my answers anonymous?">
        Well technically, yes, but if you’re only playing with one other person,
        it’s pretty easy to figure out how they answered. But any group larger
        than 2 players is completely anonymous.
      </FaqItem>
      <FaqItem question="Does each player need 2 devices to play on Zoom?">
        Here are a couple of ways to play Who Said True on Zoom from best to
        least good:
        <ul className="list-disc list-inside mt-2">
          <li>
            One computer (or laptop) and a second monitor - Have Zoom running on
            one monitor and play 9 Truths on the second monitor.
          </li>
          <li>
            One computer (or laptop) and a smartphone - Have Zoom running on the
            computer and play 9 Truths on your phone
          </li>
          <li>
            One computer (or laptop) - Have Zoom running in one browser tab and
            play 9 Truths in another browser tab
          </li>
          <li>
            One smartphone - Start the Zoom session and then open a browser and
            play 9 Truths. This one is tougher because you can hear the audio,
            but you can't easily see people's faces
          </li>
        </ul>
      </FaqItem>
      <FaqItem question="How many people can play a game?">
        There is no limit to the number of people that can play in a game, but
        the bigger the group the fewer stories and conversations there will be
        about the questions/answers.
      </FaqItem>
      <FaqItem question="Is Who Said True available in other languages?">
        Not yet, but I’m working on adding additional languages.{' '}
        <Link className="text-blue-base underline" to="/contact-us">
          Contact me
        </Link>{' '}
        to vote for the language you want to be added.
      </FaqItem>
      <FaqItem question="What happened to 9 Truths?">
        It grew up and blossomed into Who Said True
      </FaqItem>
    </div>
  );
};

export default Faqs;
