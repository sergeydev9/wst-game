import TakingTooLongComponent from './TakingTooLong';

export default {
    component: TakingTooLongComponent,
    title: 'Message Displays/Taking Too Long'
}

export const TakingTooLong = () => <TakingTooLongComponent handler={() => console.log('handled')} />