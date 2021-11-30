import { types } from '@whosaidtrue/api-interfaces';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import { Lobby as LobbyUi } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAccessCode, selectIsHost, selectPlayerName, selectPlayerId, selectPlayerList, removePlayer } from "./gameSlice";
import useSocket from '../socket/useSocket';
import { showError } from '../modal/modalSlice';
import OneLiners from '../one-liners/OneLiners';
import { payloads } from '@whosaidtrue/api-interfaces';

const Lobby: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const accessCode = useAppSelector(selectAccessCode);
    const isHost = useAppSelector(selectIsHost);
    const playerId = useAppSelector(selectPlayerId)
    const players = useAppSelector(selectPlayerList);
    const playerName = useAppSelector(selectPlayerName)

    // get all players other than current user. Current user's name is displayed differently
    const otherPlayers = () => players.filter(p => p.id !== playerId);

    // Creates buttons to remove players if a player is host
    const handlerFactory = (player: PlayerRef) => {
        if (isHost) {

            return () => {
                sendMessage(types.REMOVE_PLAYER, { ...player, event_origin: 'lobby' } as payloads.PlayerEvent, ack => {

                    // if ack was anything other than 'ok' show an error message
                    // if removal succeeded, host will receive message from server.
                    // That is handled in the socket provider
                    if (ack !== 'ok') {
                        dispatch(showError('Could not remove player from the game'));
                    }

                })
            }
        } else {
            return () => null; // if the player isn't the host, then the handler should be null
        }
    }

    return (
        <LobbyUi
            accessCode={accessCode}
            isHost={isHost}
            otherPlayers={otherPlayers()}
            playerName={playerName}
            footerMessage={'The host will start the game once all players have joined.'}
            handlerFactory={handlerFactory}>
            <OneLiners />
        </LobbyUi>
    )
}

export default Lobby;