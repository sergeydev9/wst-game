import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hamburger, NavLogo } from '@whosaidtrue/ui';
import LargeNav from './LargeNav';
import { useAppSelector } from '../../app/hooks';
import { selectGameStatus } from '../game/gameSlice';
import InGameNav from './InGameNav';

const NavBar: React.FC = () => {
    const gameStatus = useAppSelector(selectGameStatus);

    return (
        <nav className={`w-full flex flex-row justify-between items-center ${gameStatus === "playing" ? "bg-subtle-primary" : "bg-white-ish"} filter drop-shadow-light mb-12 h-24 px-6`}>
            <NavLink to="/"><NavLogo /></NavLink>
            {(gameStatus !== "playing") && <>
                <LargeNav />
                <nav className="md:hidden">
                    <Hamburger />
                </nav>
            </>}
            {gameStatus === "playing" && <InGameNav />}
        </nav>
    )
}

export default NavBar;