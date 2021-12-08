import HostActions from "./HostActions";
import Button from '../../button/Button';

export default {
    component: HostActions,
    title: 'Gameplay/Host Actions'
}

export const Required = () => (
    <HostActions actionText="Start the game when everbody is in the game lobby">
        <Button>Start Game</Button>
    </HostActions>
)

export const OptionalWithTwoButtons = () => (
    <HostActions>
        <Button $secondary>Skip Question</Button>
        <Button $secondary>Take Over Reading the Question</Button>
    </HostActions>
)

export const OptionalWithOneButton = () => (
    <HostActions>
        <Button $secondary>Skip to Results</Button>
    </HostActions>)
