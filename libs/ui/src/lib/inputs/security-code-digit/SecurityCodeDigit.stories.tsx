import Digit from './SecurityCodeDigit';

export default {
    component: Digit,
    title: 'Inputs/Security Code Digit',
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
}

export const SecurityCodeDigit = () => <Digit />