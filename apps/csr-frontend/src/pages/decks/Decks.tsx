import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DeckSelection, selectIsGuest } from '../../features';
import { clearSelectedDeck } from '../../features/decks/deckSlice';
import { selectIsHost } from '../../features';

const Decks: React.FC = () => {
  const pageTitle = 'Decks';

  const dispatch = useAppDispatch();
  const isGuest = useAppSelector(selectIsGuest);
  const isHost = useAppSelector(selectIsHost);

  // clear state when unmount
  useEffect(() => {
    return () => {
      dispatch(clearSelectedDeck());
    };
  }, [dispatch, isGuest, isHost]);

  return (
    <>
      <Helmet>
        <title>Who Said True?! - {pageTitle}</title>
      </Helmet>
      <DeckSelection />
    </>
  );
};

export default Decks;
