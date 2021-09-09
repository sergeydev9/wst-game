import ToggleInput from './Toggle';

export default {
    component: ToggleInput,
    title: 'Inputs/Toggle',
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
}

export const Toggle = () => <ToggleInput></ToggleInput>