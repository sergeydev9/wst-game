import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { AuthForm, selectFullModal } from '../../features'
import { Headline } from "@whosaidtrue/ui";
import { setFullModal, setCameFromDeckDetails, selectCameFromDeckDetails } from '../modal/modalSlice';

const Login: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const isModal = useAppSelector(selectFullModal) === 'login';
    const history = useHistory();
    const dispatch = useAppDispatch();
    const cameFromDetails = useAppSelector(selectCameFromDeckDetails);

    useEffect(() => {
        return () => {
            if (cameFromDetails) {
                dispatch(setCameFromDeckDetails(false)); // change status here no matter what
            }
        }
    })

    const close = () => {
        dispatch(setFullModal(''));
    }

    // stay in current location if loging in from modal
    const successHandler = () => {
        if (!isModal) {
            history.push('/');
        } else {
            if (cameFromDetails) {
                dispatch(setFullModal('deckDetails'))
            } else {
                dispatch(setFullModal(''));
            }
        }
    }

    // render
    return (
        <>
            <AuthForm onSuccess={successHandler} endpoint="/user/login" buttonlabel="Log In" title="Log In" $showForgotPassword />
            <div className="text-center text-basic-black mt-8">
                <Headline>Don't have an account?</Headline>
                {(isModal ?
                    <Headline className="underline cursor-pointer" onClick={() => dispatch(setFullModal('createAccount'))}>Create Account</Headline> :
                    <Link onClick={close} to="/create-account"><Headline className="underline">Create Account</Headline></Link>
                )}
            </div>
        </>

    )
}

export default Login;
