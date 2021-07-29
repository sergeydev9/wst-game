import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavLogo } from '@whosaidtrue/ui';

const NavBar: React.FC = () => {
    return (
        <nav className="w-screen flex flex-row justify-between h-32">
            <NavLink to="/"><NavLogo /></NavLink>
        </nav>
    )
}

export default NavBar;