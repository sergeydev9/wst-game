import { useState, } from 'react';
import { RemovePlayers, RemovePlayersRow } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectPlayers } from "../../game/gameSlice";
import { setFullModal } from '../..';

const RemovePlayersModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const players = useAppSelector(selectPlayers)


    const [searchText, setSearchText] = useState('')
    const filtered = players.filter(player => player.name.toLowerCase().includes(searchText.toLowerCase()))

    const helper = () => {
        return filtered.map((p, i) => (
            <RemovePlayersRow
                key={i}
                name={p.name}
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