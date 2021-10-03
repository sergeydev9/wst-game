import { useMemo } from 'react';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import { Lobby as LobbyUi } from "@whosaidtrue/ui";
import { useAppSelector } from "../../app/hooks";
import { selectIsHost, selectPlayers, selectPlayerName, selectPlayerId } from "./gameSlice";
import useSocket from '../socket/useSocket';

const Lobby: React.FC = () => {
    const { socket } = useSocket();
    const isHost = useAppSelector(selectIsHost);
    const playerId = useAppSelector(selectPlayerId)
    const players = useAppSelector(selectPlayers);
    const playerName = useAppSelector(selectPlayerName)
    const otherPlayers = useMemo(() => players.filter(p => p.id !== playerId), [players, playerId])

    const handlerFactory = (player: PlayerRef) => {
        if (isHost) {
            return (e: React.MouseEvent) => {
                socket?.send('RemovePlayer', player)
            }
        } else {
            return (e: React.MouseEvent) => {
                console.log(player.player_name, 'fudge')
            }
        }
    }

    return (


        <LobbyUi
            isHost={isHost}
            otherPlayers={otherPlayers}
            playerName={playerName}
            footerMessage={'The host will start the game once all players have joined.'}
            handlerFactory={handlerFactory} />

    )
}

export default Lobby;