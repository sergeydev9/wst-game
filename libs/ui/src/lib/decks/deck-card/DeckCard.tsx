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
        <div className="flex flex-col items-center filter drop-shadow-card p-4 bg-purple-card-bg w-max h-72 rounded-3xl gap-8 cursor-pointer" {...rest}>
            <img className={`${noPointer ? '' : 'cursor-pointer'} flex-shrink-0`} src={thumbnailUrl} width="240px" height="160px" alt="Deck Thumbnail" />
            <div className="w-full flex items-center justify-center gap-6">
                <h2 className="text-purple-dark font-bold text-2xl">{name}</h2>
                <RatingLabel rating={movieRating} />
            </div>
        </div>
    )
}

export default DeckCard