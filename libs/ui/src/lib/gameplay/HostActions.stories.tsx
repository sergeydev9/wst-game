import HostActionsComponent from "./HostActions";
import Button from '../button/Button';

export default {
    component: HostActionsComponent,
    title: 'Gameplay/Host Actions'
}

export const Required = () => (
    <HostActionsComponent actionText="Start the game when everbody is in the game lobby" required={true}>
        <Button >Start Game</Button>
    </HostActionsComponent>
)

export const OptionalWithTwoButtons = () => (
    <HostActionsComponent>
        <Button $secondary >Skip Question</Button>
        <Button $secondary >Take Over Reading the Question</Button>
    </HostActionsComponent>
)

export const OptionalWithOneButton = () => (
    <HostActionsComponent>
        <Button $secondary >Skip to Results</Button>
    </HostActionsComponent>)