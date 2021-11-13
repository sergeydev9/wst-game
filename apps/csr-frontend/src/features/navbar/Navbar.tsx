import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useAppSelector } from '../../app/hooks';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { selectAccessCode, selectPlayerName } from '../game/gameSlice';
import InGameNav from './InGameNav';
import LargeNav from './LargeNav';

const NavBar: React.FC = () => {
  const gameCode = useAppSelector(selectAccessCode);
  const playerName = useAppSelector(selectPlayerName);
  const location = useLocation();
  const inGame = playerName || gameCode;

  return (
    <nav
      className={classNames(
        'w-full flex flex-row mb-20 items-center rounded-b-3xl overscroll-contain h-20 px-5',
        location.pathname === '/' && !inGame
          ? 'bg-transparent justify-end'
          : 'bg-purple-subtle-fill justify-between'
      )}
    >
      <Link
        className={location.pathname === '/' && !inGame ? 'sr-only' : ''}
        to="/"
      >
        <Logo className="w-14 h-14" />
      </Link>
      {inGame ? <InGameNav /> : <LargeNav />}
    </nav>
  );
};

export default NavBar;
