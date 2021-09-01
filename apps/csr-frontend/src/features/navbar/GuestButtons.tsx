import { Modal, NoFlexBox } from '@whosaidtrue/ui';
import { Button } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Login from '../../features/auth/Login';
import CreateAccount from '../../features/auth/CreateAccount';
import { setFullModal, selectFullModalFactory } from '../modal/modalSlice';


const GuestButtons = () => {

    const dispatch = useAppDispatch();
    const isLoginOpen = useAppSelector(selectFullModalFactory('login'))
    const isCreateAccOpen = useAppSelector(selectFullModalFactory('createAccount'))

    const close = () => {
        dispatch(setFullModal(''))
    }

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
            <Modal isOpen={isLoginOpen} onRequestClose={close}>
                <NoFlexBox className="w-96">
                    <Login />
                </NoFlexBox>
            </Modal>
            <Modal isOpen={isCreateAccOpen} onRequestClose={close}>
                <NoFlexBox className="w-28rem">
                    <CreateAccount />
                </NoFlexBox>
            </Modal>
        </>
    )
}

export default GuestButtons;