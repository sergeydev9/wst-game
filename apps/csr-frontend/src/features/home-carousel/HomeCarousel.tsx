import Slider from 'react-slick';
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs';
import { Button, Card } from '@whosaidtrue/ui';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeCarousel.css';

export interface HomeCarouselProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onLetsPlayClick: React.MouseEventHandler<HTMLButtonElement>;
}

const PrevArrow = ({ onClick }: any) => {
  return (
    <button
      className="absolute top-1/4 left-4 flex items-center justify-center bg-yellow-base h-14 w-14 rounded-full shadow-md z-10 md:top-1/2 md:-mt-7 md:left-10"
      onClick={onClick}
    >
      <BsCaretLeftFill className="text-purple-dark h-8 w-8" />
      <span className="sr-only">Prev</span>
    </button>
  );
};

const NextArrow = ({ onClick }: any) => {
  return (
    <button
      className="absolute top-1/4 right-4 flex items-center justify-center bg-yellow-base h-14 w-14 rounded-full shadow-md text-center z-10 md:top-1/2 md:-mt-7 md:right-10"
      onClick={onClick}
    >
      <BsCaretRightFill className="text-purple-dark h-8 w-8" />
      <span className="sr-only">Next</span>
    </button>
  );
};

const rules = [
  {
    title: 'The Basics',
    image: './assets/rule-1.png',
    content: (
      <p>
        A game of True/False questions that players answer anonymously. Each
        question has two parts.
      </p>
    ),
  },
  {
    title: 'Part 1 is about YOU',
    image: './assets/rule-2.png',
    content: <p>Answer whether the question is True or False for YOU.</p>,
  },
  {
    title: 'Part 2 is about your GROUP',
    image: './assets/rule-3.png',
    content: (
      <p>
        Guess how many of the players (including yourself) answered "True" for
        that same question.
      </p>
    ),
  },
  {
    title: 'Scoring',
    image: './assets/rule-4.png',
    content: (
      <p>
        You earn points based on how accurately you guess the correct number of
        "Trues".
      </p>
    ),
  },
  {
    title: 'To Start a Game',
    image: './assets/rule-5.png',
    content: (
      <>
        <p>
          One person (the Host) "Starts a Game" by choosing a Question Deck and
          sharing the generated Game Code.
        </p>
        <p>Everyone else "Joins the Game" by entering the Game Code.</p>
      </>
    ),
  },
  {
    title: 'Things to Remember',
    image: './assets/rule-6.png',
    content: (
      <>
        <p>
          It's about the laughs, not the points! Don't rush through the results;
          the follow-up questions spark the stories behind the answers!
        </p>
        <p>So pick a Host for your group and Get Started!</p>
      </>
    ),
  },
];

const settings = {
  className: 'center',
  centerMode: true,
  centerPadding: '0px',
  dots: true,
  infinite: true,
  initialSlide: 0,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const HomeCarousel: React.FC<HomeCarouselProps> = ({ onLetsPlayClick }) => {
  return (
    <div className="relative bg-basic-black bg-opacity-75 py-6 rounded-3xl select-none lg:py-10">
      <Slider {...settings}>
        {rules.map((rule, index) => (
          <div className="item text-center" key={index}>
            <Card>
              <div className="h-full flex flex-col items-center justify-center">
                <img className="h-40 w-auto mb-4" src={rule.image} alt="" />
                <div>
                  <div className="font-extrabold text-3xl text-blue-base mb-4 leading-none">
                    {rule.title}
                  </div>
                  <div className="font-extrabold space-y-3 text-xl leading-none">
                    {rule.content}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="item flex items-center justify-center h-full text-center">
          <Logo className="w-48 h-auto mx-auto mb-5" />
          <Button onClick={onLetsPlayClick}>Let's Play</Button>
        </div>
      </Slider>
    </div>
  );
};

export default HomeCarousel;
