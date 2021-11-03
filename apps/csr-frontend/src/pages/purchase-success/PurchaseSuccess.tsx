import { Link } from 'react-router-dom';
import { Title1, Box, DeckCard, Button, NoFlexBox } from "@whosaidtrue/ui";
import popper from '../../assets/party-popper-emoji.png';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGameDeck } from '../../features';

const Popper = () => {
    return <img src={popper} alt='party popper' style={{ width: '30px', height: '30px' }} width="30px" height="30px" />
}

const PurchaseSuccess: React.FC = () => {
    const dispatch = useAppDispatch()
    const deck = useAppSelector(selectGameDeck)

    return (

        <NoFlexBox className="w-28rem mx-4 sm:mx-auto px-10 text-center">
            {/* header */}
            <div className="flex flex-row gap-4 place-content-center w-full text-center mb-4">
                <Popper />
                <Title1>
                    Deck Purchased!
                </Title1>
                <Popper />
            </div>

            {/* card */}
            <DeckCard
                sfw={deck.sfw}
                className="drop-shadow-sm border relative p-2 pb-8 border-purple-subtle-stroke rounded-3xl mb-10 mx-auto"
                noPointer={true}
                name={deck.name}
                thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'}
                movieRating={deck.movie_rating} />

            {/* button */}

            <div className="block sm:w-2/3 mx-auto">
                <Button >Continue</Button>
            </div>

            {/*link */}
            <Link to="/decks" className="text-blue-base text-lg underline font-bold block my-10">Return to All Question Decks</Link>

        </NoFlexBox>

    )
}

export default PurchaseSuccess