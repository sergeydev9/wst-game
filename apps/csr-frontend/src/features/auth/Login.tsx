import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeModalsThunk, AuthForm } from '../../features'
import { Headline } from "@whosaidtrue/ui";
import { setFullModal, selectFullModalFactory } from '../modal/modalSlice';

const Login: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const isModal = useAppSelector(selectFullModalFactory('login'))
    const history = useHistory()
    const dispatch = useAppDispatch()

    const close = () => {
        dispatch(closeModalsThunk())
    }

    // stay in current location if loging in from modal
    const successHandler = () => {
        if (!isModal) {
            history.push('/')
        }
    }

    // render
    return (
        <>
            <AuthForm onSuccess={successHandler} endpoint="/user/login" buttonlabel="login" title="Login" />
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