import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { isLoggedIn } from '../auth/authSlice';
import { Button } from '@whosaidtrue/ui';
import GuestButtons from './GuestButtons';



const LargeNav: React.FC = () => {
    const loggedIn = useAppSelector(isLoggedIn);
    // const location = useLocation();

    return (
        <nav className="flex flex-row font-bold text-body-small justify-end gap-3 sm:gap-6 h-full items-center">
            {/* <a href="www.whosaidtrueforschools.com" className={`${location.pathname === '/' ? 'text-purple-subtle-fill' : 'text-purple-base'} ${loggedIn ? '' : 'hidden sm:flex'} text-xs sm:text-sm`}>Who Said True?! For Schools</a> */}
            {loggedIn ? <Button as={Link} to="/account" type="button" className="whitespace-nowrap" buttonStyle='small' $secondary >My Account</Button> : <GuestButtons />}
        </nav>
    )
}

export default LargeNav;
