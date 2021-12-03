import { Button } from '@whosaidtrue/ui';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectPlayerName, selectAccessCode } from '../game/gameSlice';
import { setFullModal } from '../modal/modalSlice';
import { BiCog } from 'react-icons/bi'

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
            <h2 className="text-basic-black font-extrabold relative mx-auto text-center text-lg sm:text-2xl leading-tight">{name ? name : `Game Code: ${accessCode}`}</h2>
            <Button type="button" buttonStyle='small' $secondary onClick={openGameOptions}>
              <BiCog className="w-6 h-6 sm:hidden" />
              <span className="sr-only sm:not-sr-only">Game Options</span>
            </Button>

        </>
    )
}

export default InGameNav;
