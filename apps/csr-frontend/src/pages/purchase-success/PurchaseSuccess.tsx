import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Title1, DeckCard, Button, NoFlexBox } from "@whosaidtrue/ui";
import { CreateGameResponse, CreateGameRequest } from '@whosaidtrue/api-interfaces';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectGameDeck,
    createGame,
    setGameStatus,
    setGameDeck,
    showError,
    setFullModal,
    clearCart,
    clearSelectedDeck,
    clearGame
} from '../../features';
import { api } from '../../api';
import popper from '../../assets/party-popper-emoji.png';


const Popper = () => {
    return <img src={popper} alt='party popper' style={{ width: '30px', height: '30px' }} width="30px" height="30px" />
}

const PurchaseSuccess: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const deck = useAppSelector(selectGameDeck);

    useEffect(() => {

        // send users out if they don't have a deck to display
        if (!deck.id) {
            history.push('/')
        }
        return () => {
            dispatch(clearCart());
            dispatch(clearSelectedDeck())
        }
    }, [deck, dispatch, history])

    // send create request
    const startGame = () => {
        // passing token in here as a prop because axios interceptor won't have access to the token
        // before the request starts executing, leading to a 401 even when log in is successful.
        return api.post<CreateGameResponse>('/games/create', { deckId: deck.id } as CreateGameRequest).then(response => {
            dispatch(createGame(response.data));
            dispatch(setGameStatus('gameCreateSuccess'));
            dispatch(setGameDeck(deck));
            history.push(`/game/invite`);
            dispatch(setFullModal(''));
        }).catch(e => {
            console.error(e);
            dispatch(showError('An error occured while creating the game'));
            dispatch(setGameStatus('gameCreateError'));
            history.push('/');
        })
    }

    return (
      <div className="px-5">
        <NoFlexBox className="mx-auto px-10 text-center w-28rem max-w-full">
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
                className="drop-shadow-sm border relative p-2 pb-8 border-purple-subtle-stroke rounded-3xl mb-10 mx-auto max-w-full"
                noPointer={true}
                name={deck.name}
                thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'}
                movieRating={deck.movie_rating} />

            {/* start game */}
            <div className="block sm:w-2/3 mx-auto">
                <Button onClick={() => startGame()}>Start a Game</Button>
            </div>

            {/* clear game state and return to decks */}
            <Link to="/decks" onClick={() => dispatch(clearGame())} className="text-blue-base text-lg underline font-bold block my-10">Return to All Question Decks</Link>

        </NoFlexBox>
      </div>
    )
}

export default PurchaseSuccess
