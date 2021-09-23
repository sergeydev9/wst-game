import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGameId } from '../../features';

const Play: React.FC = () => {
    const gameId = useAppSelector(selectGameId);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const gameSocket = io(`/socket/${gameId}`, { rememberUpgrade: true })
    }, [gameId])
    return (
        <div></div>
    )
}

export default Play