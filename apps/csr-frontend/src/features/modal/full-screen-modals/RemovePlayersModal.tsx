import { useState, useMemo } from 'react';
import { RemovePlayers, RemovePlayersRow } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectPlayerId, selectPlayerList } from "../../game/gameSlice";
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

    const helper = () => {
        return filtered.map((p, i) => (
            <RemovePlayersRow
                key={i}
                name={p.player_name}
                handler={() => {
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