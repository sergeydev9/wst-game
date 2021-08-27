import { filteredNotOwned, filteredOwned } from "./deckSelectionSlice"
import { useAppSelector } from "../../app/hooks"
import { cardsFromSet } from "../../util/functions"
import { DeckSet, Title2 } from "@whosaidtrue/ui"


const UserSelection: React.FC = () => {
    const owned = useAppSelector(filteredOwned);
    const notOwned = useAppSelector(filteredNotOwned)
    const ownedCards = cardsFromSet(owned)
    const notOwnedCards = cardsFromSet(notOwned)

    // If user doesn't own anything, don't show 'My Decks' section.
    return (
        <>
            {owned.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckSet>
                        {ownedCards}
                    </DeckSet>
                </>
            )}
            <Title2 className="text-true-white">{owned.length > 0 ? 'More ' : ''}Decks</Title2>
            <DeckSet>
                {notOwnedCards}
            </DeckSet>
        </>
    )
}


export default UserSelection