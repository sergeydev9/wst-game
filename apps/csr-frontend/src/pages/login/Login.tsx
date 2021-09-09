import { Login } from '../../features'
import { NoFlexBox } from '@whosaidtrue/ui';

const LoginPage: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {

    return (
        <NoFlexBox className="w-96 mx-auto">
            <Login />
        </NoFlexBox>

    )
}

export default LoginPage;