import Modal from 'react-modal';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';
import { Button } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Login from '../../pages/login/Login';
import CreateAccount from '../../pages/create-account/CreateAccount';
import { openLogin, openCreateAcc, closeModals, selectCreateAcc, selectLoginOpen } from '../modal/modalSlice';
import React from 'react';


// TODO: move modal styling into UI lib.
const modalStyles = {
    content: {
        zIndex: 5,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: 'min-content',
        width: 'min-content',
        padding: 0,
        borderRadius: '1.5rem'
    }
}

const overlayClassName = "bg-opacity-60 bg-black fixed top-0 left-0 right-0 bottom-0"

const GuestButtons = () => {

    const dispatch = useAppDispatch();
    const isLoginOpen = useAppSelector(selectLoginOpen)
    const isCreateAccOpen = useAppSelector(selectCreateAcc)

    const close = (e: React.MouseEvent) => {
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
            <Modal overlayClassName={overlayClassName} isOpen={isLoginOpen} style={modalStyles} onRequestClose={close}>
                <GrFormClose className="absolute right-8 top-11 text-5xl font-black cursor-pointer" onClick={close} />
                <Login />
            </Modal>
            <Modal overlayClassName={overlayClassName} isOpen={isCreateAccOpen} style={modalStyles} onRequestClose={close}>
                <GrFormClose className="absolute right-4 top-11 text-5xl font-black cursor-pointer" onClick={close} />
                <CreateAccount />
            </Modal>
        </>
    )
}

export default GuestButtons;