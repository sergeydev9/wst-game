import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavLogo } from '@whosaidtrue/ui';
import LargeNav from './LargeNav';
import { useAppSelector } from '../../app/hooks';
import { selectAccessCode, selectPlayerName } from '../game/gameSlice';
import InGameNav from './InGameNav';

const NavBar: React.FC = () => {
    const gameCode = useAppSelector(selectAccessCode);
    const playerName = useAppSelector(selectPlayerName);
    const location = useLocation();
    const inGame = (playerName || gameCode)

    return (
        <nav className={`w-full flex flex-row justify-between mb-20 items-center ${location.pathname === '/' && !inGame ? 'bg-transparent' : 'bg-purple-subtle-fill'} rounded-b-3xl overscroll-contain h-20 px-5`}>
            <Link to="/"><NavLogo /></Link>
            {inGame ? <InGameNav /> : <LargeNav />}
        </nav>
    )
}

export default NavBar;