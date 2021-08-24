import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { isLoggedIn } from '../auth/authSlice';
import { WrappedButton } from '@whosaidtrue/ui';
import GuestButtons from './GuestButtons';



const LargeNav: React.FC = () => {
    const loggedIn = useAppSelector(isLoggedIn);

    return (
        <nav className="flex flex-row font-bold text-body-small justify-end gap-6 h-full items-center">
            <NavLink to="/who-said-true-school" className="text-purple-base">Who Said true For Schools</NavLink>
            {loggedIn ? <WrappedButton type="button" color='yellow' $small >My Account</WrappedButton> : <GuestButtons />}
        </nav>
    )
}

export default LargeNav;