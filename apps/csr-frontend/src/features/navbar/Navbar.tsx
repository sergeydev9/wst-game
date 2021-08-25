import React from 'react';
import { Link } from 'react-router-dom';
import { NavLogo } from '@whosaidtrue/ui';
import LargeNav from './LargeNav';
import { useAppSelector } from '../../app/hooks';
import { selectAccessCode, selectPlayerName } from '../game/gameSlice';
import InGameNav from './InGameNav';

const NavBar: React.FC = () => {
    const gameCode = useAppSelector(selectAccessCode);
    const playerName = useAppSelector(selectPlayerName);

    return (
        <nav className="w-full flex flex-row justify-between mb-20 items-center bg-purple-subtle-fill rounded-b-3xl overscroll-contain h-20 px-5">
            <Link to="/"><NavLogo /></Link>
            {(playerName || gameCode) ? <InGameNav /> : <LargeNav />}
        </nav>
    )
}

export default NavBar;