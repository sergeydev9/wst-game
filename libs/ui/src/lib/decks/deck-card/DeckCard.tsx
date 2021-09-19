import { MovieRating } from '@whosaidtrue/app-interfaces'
import React from 'react'
import RatingLabel from './RatingLabel'

export interface DeckCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    name: string;
    thumbnailUrl: string;
    movieRating: MovieRating;
    noPointer?: boolean;
}
const DeckCard: React.FC<DeckCardProps> = ({ name, movieRating, thumbnailUrl, noPointer, ...rest }) => {
    return (
        <div className=" inline-block  filter drop-shadow-card py-4 sm:px-4 bg-purple-card-bg w-64 h-64 sm:w-72 sm:h-72 rounded-3xl cursor-pointer mx-1 my-4 sm:mx-4 select-none" {...rest}>
            <img className={`${noPointer ? '' : 'cursor-pointer'} w-max block mb-8 mx-auto`} src={thumbnailUrl} width="240px" height="160px" alt="Deck Thumbnail" />
            <div className="w-full flex items-center justify-center">
                <h2 className="text-basic-black font-bold text-lg text-center mr-6 flex-initial">{name}</h2>
                <RatingLabel className="flex-none" rating={movieRating} />
            </div>
        </div>
    )
}

export default DeckCard