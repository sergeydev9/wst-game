import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { closeModalsThunk } from '../../features';
import { AuthForm } from '../../features';
import { Box, Headline } from "@whosaidtrue/ui";

const CreateAccount: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const goHome = useCallback(() => history.push('/'), [history])

    const close = () => {
        dispatch(closeModalsThunk())
    }

    // render
    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10">
            <AuthForm title="Create Account" onSuccess={goHome} buttonlabel="Create Account" endpoint="/user/register" $showMinLength />
            <div className="text-center text-basic-black mt-8">
                <Headline>Already have an account?</Headline>
                <Link onClick={close} to="/login"><Headline className="underline">Log in</Headline></Link>
            </div>
        </Box >

    )
}

export default CreateAccount;