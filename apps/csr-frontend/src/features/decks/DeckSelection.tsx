import { useEffect } from 'react';
import { LargeTitle, DeckFilterBox, DeckFilterButton } from "@whosaidtrue/ui"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    getDeckSelection,
    selectSfwOnly,
    selectMovieRatingFilters,
    addRating,
    setSfw,
    removeRating,
    selectShowAll,
    setShowAll
} from './deckSlice';
import { MovieRating } from '@whosaidtrue/app-interfaces';
import DeckList from './DeckList';

const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const isSFWOnly = useAppSelector(selectSfwOnly)
    const movieFilters = useAppSelector(selectMovieRatingFilters)
    const isShowAll = useAppSelector(selectShowAll);

    const isInFilters = (rating: MovieRating) => {
        return movieFilters.some(r => r === rating)
    }

    useEffect(() => {
        dispatch(getDeckSelection())
    }, [dispatch])

    const toggleRating = (rating: MovieRating) => (_: React.MouseEvent) => {
        if (isInFilters(rating)) {
            dispatch(removeRating(rating))
        } else {
            dispatch(addRating(rating))
        }
    }

    const toggleSfw = () => {
        dispatch(setSfw(!isSFWOnly))
    }

    const toggleAll = () => {
        dispatch(setShowAll())
    }

    return (
        <div className="container mx-auto px-4 flex flex-col items-center gap-12 max-w-2xl">
            <LargeTitle className="text-white text-center">Choose a Question Deck</LargeTitle>
            <DeckFilterBox>
                <DeckFilterButton onClick={toggleAll} selected={isShowAll} filterValue="ALL" />
                <DeckFilterButton onClick={toggleRating('PG')} selected={isInFilters('PG')} filterValue="PG" />
                <DeckFilterButton onClick={toggleRating('PG13')} selected={isInFilters('PG13')} filterValue="PG13" />
                <DeckFilterButton onClick={toggleRating('R')} selected={isInFilters('R')} filterValue="R" />
                <DeckFilterButton onClick={toggleSfw} selected={isSFWOnly} filterValue="SFW" />
            </DeckFilterBox>
            <DeckList />
        </div>
    )
}

export default Decks