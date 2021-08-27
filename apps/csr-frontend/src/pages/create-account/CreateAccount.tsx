import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { closeModalsThunk } from '../../features';
import { AuthForm } from '../../features';
import { Headline } from "@whosaidtrue/ui";

const CreateAccount: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const goHome = useCallback(() => history.push('/'), [history])

    const close = () => {
        dispatch(closeModalsThunk())
    }

    // render
    return (
        <div className="px-8 w-96  mx-12 py-10">
            <AuthForm title="Create Account" onSuccess={goHome} buttonlabel="Create Account" endpoint="/user/register" $showMinLength />
            <div className="text-center text-basic-black mt-8">
                <Headline>Already have an account?</Headline>
                <Link onClick={close} to="/login"><Headline className="underline">Log in</Headline></Link>
            </div>
        </div >

    )
}

export default CreateAccount;