import React from 'react';
import { Link } from 'react-router-dom';
import { Hamburger, NavLogo } from '@whosaidtrue/ui';
import LargeNav from './LargeNav';
import { useAppSelector } from '../../app/hooks';
import { selectGameStatus } from '../game/gameSlice';
import InGameNav from './InGameNav';

const NavBar: React.FC = () => {
    const gameStatus = useAppSelector(selectGameStatus);

    return (
        <nav className="w-full flex flex-row justify-between mb-20 items-center bg-purple-subtle-fill rounded-b-3xl overscroll-contain h-20 px-5">
            <Link to="/"><NavLogo /></Link>
            {(gameStatus === "notInGame") && <LargeNav />}
            {gameStatus !== "notInGame" && <InGameNav />}
        </nav>
    )
}

export default NavBar;