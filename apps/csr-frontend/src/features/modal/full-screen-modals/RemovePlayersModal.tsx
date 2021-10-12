import { useState, useMemo } from 'react';
import { RemovePlayers, RemovePlayersRow } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectPlayerId, selectPlayerList } from "../../game/gameSlice";
import { setTarget } from '../../host/hostSlice';
import { setFullModal } from '../..';

const RemovePlayersModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const players = useAppSelector(selectPlayerList);
    const playerId = useAppSelector(selectPlayerId);

    const [searchText, setSearchText] = useState('')

    // filters list of players using input value
    const filtered = useMemo(() => {
        return players.filter(player => player.player_name.toLowerCase().includes(searchText.toLowerCase()) && player.id !== playerId)
    }, [searchText, players, playerId])

    // create a button for each player in the game.
    // Clicking the button sets them as the target
    // for the current action
    const helper = () => {
        return filtered.map((p, i) => (
            <RemovePlayersRow
                key={i}
                name={p.player_name}
                handler={() => {
                    dispatch(setTarget({ targetId: p.id, targetName: p.player_name }))
                    dispatch(setFullModal('confirmRemovePlayer'))
                }} />
        ))
    }

    return (
        <RemovePlayers onChange={(e) => setSearchText(e.target.value)}>
            {helper()}
        </RemovePlayers>
    )
}

export default RemovePlayersModal;