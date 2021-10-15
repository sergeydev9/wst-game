import tw from "tailwind-styled-components";
import yawn from '../assets/yawning-face.png';
import laugh from '../assets/face-with-tears-of-joy.png';
import { UserRating } from "@whosaidtrue/app-interfaces";

const RatingButton = tw.div`
rounded-full
hover:bg-purple-50
active:bg-purple-100
bg-purple-card-bg
cursor-pointer
border
border-purple-subtle-stroke
shadow-rating-button
p-4
`
interface SubmitRatingProps extends React.HTMLAttributes<HTMLDivElement> {
    submitRatingHandler: (val: UserRating) => void;
}

const SubmitRating: React.FC<SubmitRatingProps> = ({ submitRatingHandler }) => {
    return (

        < div className={`
          flex
          flex-col
          gap-5
          py-6
          mb-16
          sm:mb-10
          rounded-3xl
          items-center
          bg-purple-subtle-fill
          border-2
        border-purple-subtle-stroke
         w-4/5
         sm:w-3/5
         mx-auto
  `}>
            <h4 className="text-sm sm:text-md font-black text-center sm:w-3/5 mx-auto">Was it a fun question?</h4>
            <div className="flex flex-row gap-4 sm:gap-8 w-max">
                <RatingButton><img src={yawn} alt='yawning emoji' width="40px" height="50px" onClick={() => submitRatingHandler('bad')} /></RatingButton>
                <RatingButton><img src={laugh} alt='laugh emoji' width="40px" height="50px" onClick={() => submitRatingHandler('great')} /></RatingButton>

            </div>
        </div >
    )
}

export default SubmitRating;