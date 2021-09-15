import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Headline } from "@whosaidtrue/ui";
import { closeModalsThunk, setFullModal, selectFullModal } from '../modal/modalSlice';
import AuthForm from './AuthForm';

const CreateAccount: React.FC = () => {
    const isModal = useAppSelector(selectFullModal) === 'createAccount'

    const history = useHistory();
    const dispatch = useAppDispatch();


    const close = () => {
        dispatch(closeModalsThunk())
    }

    // stay in current location if creating from modal
    const successHandler = () => {
        if (!isModal) {
            history.push('/')
        }
    }

    // render
    return (
        <>
            <AuthForm title="Create Account" onSuccess={successHandler} buttonlabel="Create Account" endpoint="/user/register" $showMinLength />
            <div className="text-center text-basic-black mt-8 mx-12">
                <Headline>Already have an account?</Headline>
                {(isModal ?
                    <Headline className="underline cursor-pointer" onClick={() => dispatch(setFullModal('login'))}>Login</Headline> :
                    <Link onClick={close} to="/login"><Headline className="underline">Login</Headline></Link>
                )}
            </div>
        </>

    )
}

export default CreateAccount;