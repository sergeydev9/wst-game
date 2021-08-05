import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hamburger } from '@whosaidtrue/ui';
import LargeNav from './LargeNav';
import { NavLogo } from '@whosaidtrue/ui';

const NavBar: React.FC = () => {
    return (
        <nav className="w-full flex flex-row justify-between items-center bg-white-ish filter drop-shadow-light mb-12 h-24 px-6">
            <NavLink to="/"><NavLogo /></NavLink>
            <LargeNav />
            <nav className="md:hidden">
                <Hamburger />
            </nav>
        </nav>
    )
}

export default NavBar;