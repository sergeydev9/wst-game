import React from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '@whosaidtrue/ui';

const LargeNav: React.FC = () => {
    const linkClass = "mx-12 text-primary"
    return (
        <nav className="hidden md:flex md:flex-row md:justify-end md:gap-4 h-full items-center">
            <NavLink to="/who-said-true-school" className={linkClass}>Who Said true For Schools</NavLink>
            <NavLink to="/how-to-play" className={linkClass}>How to Play</NavLink>
            <Button>Log in or Sign Up</Button>
            <Button>Contact Us</Button>
        </nav>
    )
}

export default LargeNav;