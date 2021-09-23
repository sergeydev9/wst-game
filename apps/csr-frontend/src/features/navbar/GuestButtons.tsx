import { Button } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { setFullModal } from '../modal/modalSlice';


const GuestButtons = () => {
    const dispatch = useAppDispatch();

    const openLoginModal = (e: React.MouseEvent) => {
        dispatch(setFullModal('login'));
    }

    const openCreateAccModal = (e: React.MouseEvent) => {
        dispatch(setFullModal('createAccount'))
    }

    return (
        <>
            <Button onClick={openLoginModal} type="button" buttonStyle='small' $secondary>Log In</Button>
            <Button onClick={openCreateAccModal} type="button" buttonStyle='small' $secondary>Create Account</Button>

        </>
    )
}

export default GuestButtons;