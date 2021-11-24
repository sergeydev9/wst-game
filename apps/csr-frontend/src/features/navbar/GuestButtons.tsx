import { useLocation } from 'react-router-dom';
import { Button } from '@whosaidtrue/ui';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { isLoggedIn } from '../auth/authSlice';
import { setFullModal } from '../modal/modalSlice';


const GuestButtons = () => {
    const loggedIn = useAppSelector(isLoggedIn);
    const location = useLocation();

    const dispatch = useAppDispatch();

    const openLoginModal = () => {
        dispatch(setFullModal('login'));
    }

    const openCreateAccModal = () => {
        dispatch(setFullModal('createAccount'))
    }

    return (
        <>
            {!loggedIn && <button onClick={openLoginModal} className={`font-bold ${location.pathname === '/' ? 'text-purple-subtle-fill' : 'text-purple-base'} whitespace-nowrap`} type="button">Log In</button>}
            <Button onClick={openCreateAccModal} className="whitespace-nowrap" type="button" data-cy="create-account" buttonStyle='small' $secondary>Create Account</Button>
        </>
    )
}

export default GuestButtons;
