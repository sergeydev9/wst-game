import React from 'react';
import { BlueLink, BlueSolidButton, BlueBorderButton } from '@whosaidtrue/ui';
import { NavLink } from 'react-router-dom';

const LargeNav: React.FC = () => {
    const linkClass = "mx-12"
    return (
        <nav className="hidden md:flex md:flex-row md:justify-end md:gap-4 h-full items-center">
            <NavLink to="/who-said-true-school" className={linkClass}><BlueLink>Who Said true For Schools</BlueLink></NavLink>
            <NavLink to="/how-to-play" className={linkClass}><BlueLink>How to Play</BlueLink></NavLink>
            <BlueSolidButton>Log in or Sign Up</BlueSolidButton>
            <BlueBorderButton>Contact Us</BlueBorderButton>
        </nav>
    )
}

export default LargeNav;