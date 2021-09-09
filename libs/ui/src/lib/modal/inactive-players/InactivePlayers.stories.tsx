import InactivePlayersComponent from "./InactivePlayers";
import RemovePlayerListItem from "./RemovePlayerListItem";

export default {
    component: InactivePlayersComponent,
    title: 'Modals/Inactive Players'
}


export const InactivePlayers = () => (
    <InactivePlayersComponent numNoAnswer={2} cancelHandler={() => null} confirmHandler={() => null} >
        <RemovePlayerListItem removeHandler={() => null} label="Mystic Raccoon (disconnected)" />
        <RemovePlayerListItem removeHandler={() => null} label="Chuffed Caterpillar" />
    </InactivePlayersComponent>
)