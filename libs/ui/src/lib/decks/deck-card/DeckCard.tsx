import React from 'react'
import RatingLabel from './RatingLabel'

export interface DeckCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    name: string;
    thumbnailUrl: string;
    movieRating: string;
    noPointer?: boolean;
}
const DeckCard: React.FC<DeckCardProps> = ({ name, movieRating, thumbnailUrl, noPointer, ...rest }) => {
    return (
        <div className="flex flex-col items-center filter drop-shadow-card p-4 bg-purple-card-bg w-56 h-80 rounded-3xl cursor-pointer" {...rest}>
            <RatingLabel>{movieRating}</RatingLabel>
            <img className={`${noPointer ? '' : 'cursor-pointer'} flex-shrink-0`} src={thumbnailUrl} width="230px" height="213px" alt="Deck Thumbnail" />
            <div className="w-full flex h-full items-center justify-center">
                <h2 className="text-purple-dark mt-4 font-bold text-2xl">{name}</h2>
            </div>
        </div>
    )
}

export default DeckCard