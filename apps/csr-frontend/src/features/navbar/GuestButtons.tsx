import { Button } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { setFullModal } from '../modal/modalSlice';


const GuestButtons = () => {
    const dispatch = useAppDispatch();

    const openLoginModal = () => {
        dispatch(setFullModal('login'));
    }

    const openCreateAccModal = () => {
        dispatch(setFullModal('createAccount'))
    }

    return (
        <>
            <Button onClick={openLoginModal} className="whitespace-nowrap" type="button" buttonStyle='small' $secondary>Log In</Button>
            <Button onClick={openCreateAccModal} className="whitespace-nowrap" type="button" data-cy="create-account" buttonStyle='small' $secondary>Create Account</Button>

        </>
    )
}

export default GuestButtons;