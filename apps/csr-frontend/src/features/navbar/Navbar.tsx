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
        <nav className={`w-full flex flex-row justify-between mb-20 items-center ${gameStatus === "playing" ? "bg-subtle-primary" : "bg-purple-subtle-fill rounded-b-3xl"} overscroll-containh-20 px-5`}>
            <Link to="/"><NavLogo /></Link>
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