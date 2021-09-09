import HostActionsComponent from "./HostActions";
import Button from '../button/Button';

export default {
    component: HostActionsComponent,
    title: 'Gameplay/Host Actions'
}

export const HostActions = () => (
    <HostActionsComponent actionText="Start the game when everbody is in the game lobby" >
        <Button>Start Game</Button>
    </HostActionsComponent>
)