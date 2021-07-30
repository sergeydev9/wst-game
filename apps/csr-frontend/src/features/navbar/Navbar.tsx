import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hamburger, NavLogo } from '@whosaidtrue/ui';
import LargeNav from '../large-nav/LargeNav';

const NavBar: React.FC = () => {
    return (
        <nav className="w-full flex flex-row justify-between items-center h-22 py-4 px-6">
            <NavLink to="/"><NavLogo /></NavLink>
            <LargeNav />
            <nav className="md:hidden">
                <Hamburger />
            </nav>
        </nav>
    )
}

export default NavBar;