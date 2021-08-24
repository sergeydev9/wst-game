import React from 'react'
import RatingLabel from './RatingLabel'
import { ReactComponent as Placeholder } from './placeholder.svg'

export interface DeckCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    name: string;
    thumbnailUrl: string;
    movieRating: string
}
const DeckCard: React.FC<DeckCardProps> = ({ name, movieRating, thumbnailUrl }) => {
    return (
        <div className="flex flex-col items-center filter drop-shadow-card p-4 bg-purple-card-bg w-56 h-80 rounded-3xl" >
            <RatingLabel>{movieRating}</RatingLabel>
            <object datatype="img/png" data={thumbnailUrl} width="230px" height="213px" style={{ flexShrink: 0 }} >
                <Placeholder className="w-full h-full p-0" />
            </object>
            <div className="w-full flex h-full items-center justify-center">
                <h2 className="text-purple-dark font-bold text-2xl">{name}</h2>
            </div>
        </div>
    )
}

export default DeckCard