import { lazy, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loading from '../loading/Loading';
import { selectPlayerName, selectAccessCode } from '../game/gameSlice';
import { Button, Modal, NoFlexBox, Box } from '@whosaidtrue/ui';
import { setFullModal } from '../modal/modalSlice';
import GameOptionsModal from '../modal/full-screen-modals/GameOptionsModal';


const InGameNav: React.FC = () => {
    const dispatch = useAppDispatch();

    const name = useAppSelector(selectPlayerName);
    const accessCode = useAppSelector(selectAccessCode)

    const openGameOptions = () => {
        dispatch(setFullModal('gameOptions'))
    }

    // if there is a name, then show it. Otherwise show the game code
    return (
        <>
            <h2 className="text-basic-black font-extrabold relative mx-auto text-2xl leading-tight">{name ? name : `Game Code: ${accessCode}`}</h2>
            <Button type="button" buttonStyle='small' $secondary onClick={openGameOptions}>Game Options</Button>

        </>
    )
}

export default InGameNav;