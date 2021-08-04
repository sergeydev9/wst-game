import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from '../auth/authSlice';

import { DropShadowButton } from '@whosaidtrue/ui';
import { ROUTES } from "../../util/constants";

const unauthenticatedButtons = () => (
    <>
        <DropShadowButton buttonstyle="solid">Login</DropShadowButton>
        <DropShadowButton buttonstyle="border-light">Create Account</DropShadowButton>
    </>
)

const LargeNav: React.FC = () => {

    const loggedIn = useSelector(selectAuthStatus);

    const linkClass = "text-primary"
    return (
        <nav className="hidden md:flex md:flex-row font-bold text-body-small md:justify-end gap-8 h-full items-center">
            <NavLink to="/who-said-true-school" className={linkClass}>Who Said true For Schools</NavLink>
            <NavLink to="/how-to-play" className={linkClass}>How to Play</NavLink>
            <NavLink to={ROUTES.contactUs} className={linkClass}>Contact Us</NavLink>
            {loggedIn === "loggedIn" ? <DropShadowButton buttonstyle="border-thick">My Account</DropShadowButton> : unauthenticatedButtons()}
        </nav>
    )
}

export default LargeNav;