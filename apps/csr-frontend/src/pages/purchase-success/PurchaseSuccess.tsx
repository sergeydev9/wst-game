import { Link } from 'react-router-dom';
import { Title1, Box, DeckCard, Button } from "@whosaidtrue/ui";
import popper from '../../assets/party-popper-emoji.png';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGameDeck } from '../../features';

const PurchaseSuccess: React.FC = () => {
    const dispatch = useAppDispatch()
    const deck = useAppSelector(selectGameDeck)

    return (

        <Box boxstyle="white" className="sm:w-max mx-4 sm:mx-auto p-10">
            {/* header */}
            <div className="flex flex-row gap-4 place-items-center text-center mb-4">
                <img src={popper} alt='party popper' width="25px" height="25px" />
                <Title1>
                    Deck Purchased!
                </Title1>
                <img src={popper} alt='party popper' width="25px" height="25px" />
            </div>

            {/* card */}
            <DeckCard
                className="drop-shadow-sm border relative p-2 pb-8 border-purple-subtle-stroke rounded-3xl mb-10"
                noPointer={true}
                name={deck.name}
                thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'}
                movieRating={deck.movie_rating} />

            {/* button */}
            <div className="self-stretch">
                <Button >Continue</Button>
            </div>

            {/*link */}
            <Link to="/decks" className="text-blue-base text-lg underline font-bold mt-8">Return to All Question Decks</Link>

        </Box>

    )
}

export default PurchaseSuccess