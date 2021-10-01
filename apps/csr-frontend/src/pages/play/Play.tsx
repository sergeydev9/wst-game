import { UserGameStatus } from '@whosaidtrue/app-interfaces';
import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGameStatus, Lobby } from '../../features';

const Play: React.FC = () => {
    const gameStatus = useAppSelector(selectGameStatus);

    return (
        <>
            <div></div>
            {gameStatus === "lobby" as UserGameStatus && <Lobby />}
        </>
    )
}

export default Play