import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { isLoggedIn } from '../auth/authSlice';
import { Button } from '@whosaidtrue/ui';
import GuestButtons from './GuestButtons';



const LargeNav: React.FC = () => {
    const loggedIn = useAppSelector(isLoggedIn);
    const location = useLocation();

    return (
        <nav className="flex flex-row font-bold text-body-small justify-end gap-6 h-full items-center">
            <Link to="/who-said-true-school" className={`${location.pathname === '/' ? 'text-white-ish' : 'text-purple-base'} text-sm sm:text-md`}>Who Said true For Schools</Link>
            {loggedIn ? <Button type="button" buttonStyle='small' $secondary ><Link to='/account'>My Account </Link></Button> : <GuestButtons />}
        </nav>
    )
}

export default LargeNav;