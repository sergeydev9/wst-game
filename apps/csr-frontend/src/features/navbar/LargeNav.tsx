import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectAuthStatus } from '../auth/authSlice';
import { WrappedButton } from '@whosaidtrue/ui';

const loggedInButtons = () => {
    return (
        <>
            <WrappedButton type="button" color='yellow' $small>Log In</WrappedButton>
            <WrappedButton type="button" color="yellow" $small>Create Account</WrappedButton>
        </>
    )
}

const LargeNav: React.FC = () => {

    const loggedIn = useAppSelector(selectAuthStatus);

    return (
        <nav className="hidden md:flex md:flex-row font-bold text-body-small md:justify-end gap-6 h-full items-center">
            <NavLink to="/who-said-true-school" className="text-purple-base">Who Said true For Schools</NavLink>
            {loggedIn === 'loggedIn' ?
                <WrappedButton type="button" color='yellow' $small >My Account</WrappedButton> : loggedInButtons()}
        </nav>
    )
}

export default LargeNav;