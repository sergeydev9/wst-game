import { Modal } from '@whosaidtrue/ui';
import { Button } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Login from '../../pages/login/Login';
import CreateAccount from '../../pages/create-account/CreateAccount';
import { openLogin, openCreateAcc, closeModals, selectCreateAcc, selectLoginOpen } from '../modal/modalSlice';


const GuestButtons = () => {

    const dispatch = useAppDispatch();
    const isLoginOpen = useAppSelector(selectLoginOpen)
    const isCreateAccOpen = useAppSelector(selectCreateAcc)

    const close = () => {
        dispatch(closeModals())
    }

    const openLoginModal = (e: React.MouseEvent) => {
        dispatch(openLogin());
    }

    const openCreateAccModal = (e: React.MouseEvent) => {
        dispatch(openCreateAcc())
    }

    return (
        <>
            <Button onClick={openLoginModal} type="button" buttonStyle='small' $secondary>Log In</Button>
            <Button onClick={openCreateAccModal} type="button" buttonStyle='small' $secondary>Create Account</Button>
            <Modal isOpen={isLoginOpen} onRequestClose={close}>
                <Login />
            </Modal>
            <Modal isOpen={isCreateAccOpen} onRequestClose={close}>
                <CreateAccount />
            </Modal>
        </>
    )
}

export default GuestButtons;