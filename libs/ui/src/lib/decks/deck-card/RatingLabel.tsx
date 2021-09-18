import tw from "tailwind-styled-components";
import { backgroundColorPicker } from '@whosaidtrue/util';
import { MovieRating } from "@whosaidtrue/app-interfaces";

export interface RatingLabelProps extends React.HtmlHTMLAttributes<HTMLSpanElement> {
    rating: MovieRating;
}

const Label = tw.span`
    text-white
    rounded-full
    py-2
    px-3
    text-md
    font-bold
    text-center
    w-20
    `

const RatingLabel: React.FC<RatingLabelProps> = ({ rating }) => {
    return <Label className={backgroundColorPicker(rating)}>{rating} </Label>
}

export default RatingLabel;