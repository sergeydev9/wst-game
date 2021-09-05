import { filteredNotOwned, filteredOwned } from "./deckSlice"
import { useAppSelector } from "../../app/hooks"
import { Title2 } from "@whosaidtrue/ui"
import DeckCardSet from './DeckCardSet'

const UserSelection: React.FC = () => {
    const owned = useAppSelector(filteredOwned);
    const notOwned = useAppSelector(filteredNotOwned)

    // If user doesn't own anything, don't show 'My Decks' section.
    return (
        <>
            {owned.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckCardSet decks={owned} owned={true} />
                </>
            )}
            <Title2 className="text-true-white">{owned.length > 0 ? 'More ' : ''}Decks</Title2>
            <DeckCardSet decks={notOwned} owned={false} />
        </>
    )
}

export default UserSelection