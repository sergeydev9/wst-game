import RemovePlayersComponent from "./RemovePlayers";
import RemovePlayersRow from "./RemovePlayersRow";

export default {
    component: RemovePlayersComponent,
    title: 'Modals/Remove Players'
}

export const RemovePlayers = () => (
    <RemovePlayersComponent onChange={(e) => console.log(e.target.value)}>
        <RemovePlayersRow name="Player 1" handler={() => console.log('Player 1')}></RemovePlayersRow>
        <RemovePlayersRow name="Player 2" handler={() => console.log('Player 2')}></RemovePlayersRow>
        <RemovePlayersRow name="Player 3" handler={() => console.log('Player 3')}></RemovePlayersRow>
    </RemovePlayersComponent>
)