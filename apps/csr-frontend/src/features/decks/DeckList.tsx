import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Title2, Headline, Divider } from "@whosaidtrue/ui";
import { Deck } from '@whosaidtrue/app-interfaces';
import { useAppSelector } from "../../app/hooks";
import { isLoggedIn } from '../auth/authSlice';
import {
    selectOwned,
    selectNotOwned,
    selectShowAll,
    selectSfwOnly,
    selectShouldApplyFilters,
    movieFilteredSFWOwned,
    movieFilteredSFWNotOwned,
    sfwOwned,
    sfwNotOwned,
    movieFilteredOwned,
    movieFilteredNotOwned
} from "./deckSlice";
import DeckCardSet from './DeckCardSet'

const DeckList: React.FC = () => {
    const isShowAll = useAppSelector(selectShowAll);
    const isSfwOnly = useAppSelector(selectSfwOnly);
    const allOwned = useAppSelector(selectOwned);
    const allNotOwned = useAppSelector(selectNotOwned);
    const loggedIn = useAppSelector(isLoggedIn);
    const shouldApply = useAppSelector(selectShouldApplyFilters);
    const filteredOwned = useAppSelector(movieFilteredOwned);
    const filteredNotOwned = useAppSelector(movieFilteredNotOwned)
    const sfwFilteredOwned = useAppSelector(movieFilteredSFWOwned);
    const sfwFiltredNotOwned = useAppSelector(movieFilteredSFWNotOwned);
    const sfwOwnedNotFiltered = useAppSelector(sfwOwned);
    const sfwNotOwnedNotFiltered = useAppSelector(sfwNotOwned);


    const [owned, setOwned] = useState<Deck[]>([]);
    const [notOwned, setNotOwned] = useState<Deck[]>([])

    useEffect(() => {
        // if show all button is pressed.
        if (isShowAll) {
            setOwned(allOwned);
            setNotOwned(allNotOwned)
        } else {
            // if sfw button is pressed, show only sfw decks
            if (isSfwOnly) {

                // if movie filters are selected
                if (shouldApply) {
                    setOwned(sfwFilteredOwned);
                    setNotOwned(sfwFiltredNotOwned);
                } else {
                    // if sfw is the only selected filter
                    setOwned(sfwOwnedNotFiltered);
                    setNotOwned(sfwNotOwnedNotFiltered);
                }

            } else {
                // apply only movie rating filters if not sfw only
                setOwned(filteredOwned);
                setNotOwned(filteredNotOwned);
            }
        }
    }, [
        isShowAll,
        shouldApply,
        sfwFilteredOwned,
        sfwFiltredNotOwned,
        sfwNotOwnedNotFiltered,
        sfwOwnedNotFiltered,
        allOwned,
        allNotOwned,
        filteredOwned,
        filteredNotOwned,
        isSfwOnly
    ])

    return (
        <>
            {owned.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckCardSet decks={owned} owned={true} />
                </>
            )}
            {!loggedIn && (<div className="w-2/3 lg:w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                <Divider dividerColor='white' />
                <Headline className="w-max flex-shrink-0 select-none">Can't find your decks? <Link className="cursor-pointer underline" to="/login">Log In</Link></Headline>
                <Divider dividerColor='white' />
            </div>)}
            <Title2 className="text-true-white">{owned.length > 0 ? 'Play Other ' : ''}Decks</Title2>
            <DeckCardSet decks={notOwned} owned={false} />
        </>
    )
}

export default DeckList;