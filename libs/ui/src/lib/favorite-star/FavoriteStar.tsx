import React from 'react';
import { BsStar } from '@react-icons/all-files/bs/BsStar'
import { BsStarFill } from '@react-icons/all-files/bs/BsStarFill'

export interface StarProps {
    favorite: boolean
}

const FavoriteStar: React.FC<StarProps> = ({ favorite }) => {
    return favorite ? <BsStarFill className="text-basic-black" /> : <BsStar className="text-basic-black" />
}

export default FavoriteStar