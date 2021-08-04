import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hamburger } from '@whosaidtrue/ui';
import LargeNav from '../large-nav/LargeNav';
import { ReactComponent as Logo } from './logo.svg' // typescript compiler doesn't understand this. Doesn't matter. Ignore error

const NavBar: React.FC = () => {
    return (
        <nav className="w-full flex flex-row justify-between items-center bg-white-ish filter drop-shadow-light h-24 px-6">
            <NavLink to="/"><Logo className="w-16 h-16" /></NavLink>
            <LargeNav />
            <nav className="md:hidden">
                <Hamburger />
            </nav>
        </nav>
    )
}

export default NavBar;