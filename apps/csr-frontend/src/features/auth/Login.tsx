import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { closeModalsThunk, AuthForm } from '../../features'
import { Headline } from "@whosaidtrue/ui";

const Login: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const history = useHistory()
    const dispatch = useAppDispatch()

    const close = () => {
        dispatch(closeModalsThunk())
    }

    // render
    return (
        <>
            <AuthForm onSuccess={() => history.push('/')} endpoint="/user/login" buttonlabel="login" title="Login" />
            <div className="text-center text-basic-black mt-8">
                <Headline>Don't have an account?</Headline>
                <Link onClick={close} to="/create-account"><Headline className="underline">Create Account</Headline></Link>
            </div>
        </>

    )
}

export default Login;