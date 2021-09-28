import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGameStatus } from '../../features';

const Play: React.FC = () => {
    const gameStatus = useAppSelector(selectGameStatus);

    return (
        <div></div>
    )
}

export default Play