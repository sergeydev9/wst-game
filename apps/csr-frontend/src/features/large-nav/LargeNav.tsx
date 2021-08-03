import React from 'react';
import { NavLink } from 'react-router-dom';

import { DropShadowButton } from '@whosaidtrue/ui';

const LargeNav: React.FC = () => {
    const linkClass = "text-primary"
    return (
        <nav className="hidden md:flex md:flex-row font-bold text-body-small md:justify-end gap-8 h-full items-center">
            <NavLink to="/who-said-true-school" className={linkClass}>Who Said true For Schools</NavLink>
            <NavLink to="/how-to-play" className={linkClass}>How to Play</NavLink>
            <NavLink to="/contact-us" className={linkClass}>Contact Us</NavLink>
            <DropShadowButton buttonstyle="solid">Login</DropShadowButton>
            <DropShadowButton buttonstyle="border-light">Create Account</DropShadowButton>
        </nav>
    )
}

export default LargeNav;