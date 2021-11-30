import { useEffect } from 'react';
import { LargeTitle, DeckFilterBox, DeckFilterButton } from "@whosaidtrue/ui"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    getDeckSelection,
    selectCurrentSetName,
    setCurrentSet,
    DeckSet
} from './deckSlice';
import DeckList from './DeckList';

const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentSet = useAppSelector(selectCurrentSetName);
    const isForSchools = process.env.NX_IS_FOR_SCHOOLS === 'true'; // set at build time

    const setCurrent = (deckSet: DeckSet) => {
        return () => {
            dispatch(setCurrentSet(deckSet))
        }
    }

    useEffect(() => {
        dispatch(getDeckSelection())
    }, [dispatch])

    return (
        <div className="container mx-auto px-4 flex flex-col items-center gap-12 max-w-2xl">
            <LargeTitle className="text-white text-center">Choose a Question Deck</LargeTitle>

            {/* deck filters */}
            {!isForSchools && <DeckFilterBox>
                <DeckFilterButton onClick={setCurrent('all')} selected={currentSet === 'all'} filterValue="ALL" />
                <DeckFilterButton onClick={setCurrent('PG')} selected={currentSet === 'PG'} filterValue="PG" />
                <DeckFilterButton onClick={setCurrent('PG13')} selected={currentSet === 'PG13'} filterValue="PG13" />
                <DeckFilterButton onClick={setCurrent('R')} selected={currentSet === 'R'} filterValue="R" />
                <DeckFilterButton onClick={setCurrent('sfw')} selected={currentSet === 'sfw'} filterValue="SFW" />
            </DeckFilterBox>}
            <DeckList />
        </div>
    )
}

export default Decks