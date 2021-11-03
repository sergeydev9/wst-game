import tw from "tailwind-styled-components";
import { backgroundColorPicker } from '@whosaidtrue/util';
import { MovieRating } from "@whosaidtrue/app-interfaces";

export interface RatingLabelProps extends React.HtmlHTMLAttributes<HTMLSpanElement> {
    rating: MovieRating | "SFW";
}

const Label = tw.span`
    text-white
    rounded-full
    py-1
    px-3
    text-sm
    font-bold
    text-center
    `

const RatingLabel: React.FC<RatingLabelProps> = ({ rating }) => {
    return <Label className={backgroundColorPicker(rating)}>{rating} </Label>
}

export default RatingLabel;