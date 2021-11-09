import { MovieRating } from '@whosaidtrue/app-interfaces'
import React from 'react'
import RatingLabel from './RatingLabel'

export interface DeckCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    name: string;
    sfw: boolean;
    thumbnailUrl: string;
    movieRating: MovieRating;
    noPointer?: boolean;
}
const DeckCard: React.FC<DeckCardProps> = ({ name, movieRating, thumbnailUrl, noPointer, sfw, ...rest }) => {
    return (
        <div className=" inline-block filter drop-shadow-card py-4 px-4 bg-purple-card-bg h-64 sm:h-72 rounded-3xl cursor-pointer mx-1 my-4 sm:mx-4 select-none" style={{ width: '270px' }} {...rest}>
            <img className={`${noPointer ? '' : 'cursor-pointer'} block mb-8 mx-auto rounded-2xl`} src={thumbnailUrl} style={{ width: '240px', height: '160px' }} width="240px" height="160px" alt="Deck Thumbnail" />
            <div className="w-full flex justify-around">
                <h2 className="text-basic-black font-bold text-md text-center mr-2">{name}</h2>
                <div className="flex gap-1">
                    <RatingLabel className="mr-2" rating={movieRating} />
                    {sfw && <RatingLabel rating="SFW" />}
                </div>

            </div>
        </div>
    )
}

export default DeckCard;