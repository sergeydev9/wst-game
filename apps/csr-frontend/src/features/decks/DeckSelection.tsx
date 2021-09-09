
import { useEffect } from 'react';

import { LargeTitle, DeckFilterBox, DeckFilterButton } from "@whosaidtrue/ui"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getDeckSelection, selectSfwOnly, selectMovieRatingFilters, addRating, setSfw, removeRating } from './deckSlice';
import { isLoggedIn } from '../auth/authSlice';
import UserSelection from './UserSelection';
import GuestSelection from './GuestSelection';
import { MovieRating } from '@whosaidtrue/app-interfaces';


const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(isLoggedIn);
    const isSFWOnly = useAppSelector(selectSfwOnly)
    const movieFilters = useAppSelector(selectMovieRatingFilters)

    const isNotInFilters = (rating: MovieRating) => {
        return !movieFilters.some(r => r === rating)
    }

    useEffect(() => {
        dispatch(getDeckSelection())
    }, [dispatch])

    const toggleRating = (rating: MovieRating) => (e: React.MouseEvent) => {
        if (isNotInFilters(rating)) {
            dispatch(addRating(rating))
        } else {
            dispatch(removeRating(rating))
        }
    }

    const toggleSfw = (_: React.MouseEvent) => {
        dispatch(setSfw(!isSFWOnly))
    }

    return (
        <div className="container mx-auto px-4 flex flex-col items-center gap-12 max-w-max">
            <LargeTitle className="text-white text-center">Choose a Question Deck</LargeTitle>
            <DeckFilterBox>
                <DeckFilterButton onClick={toggleRating('PG')} selected={isNotInFilters('PG')}>PG-Rated</DeckFilterButton>
                <DeckFilterButton onClick={toggleRating('PG-13')} selected={isNotInFilters('PG-13')}>PG-13-Rated</DeckFilterButton>
                <DeckFilterButton onClick={toggleRating('R')} selected={isNotInFilters('R')}>R-Rated</DeckFilterButton>
                <DeckFilterButton onClick={toggleSfw} selected={isSFWOnly}>Work Friendly</DeckFilterButton>
            </DeckFilterBox>
            {loggedIn ? <UserSelection /> : <GuestSelection />}
        </div>
    )
}

export default Decks