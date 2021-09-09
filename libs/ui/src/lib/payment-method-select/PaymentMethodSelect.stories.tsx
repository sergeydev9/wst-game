import MethodSelection from './PaymentMethodSelect';
import RadioInput from '../inputs/radio-input/RadioInput';

export default {
    component: MethodSelection,
    title: 'Misc/Payment Method Selection'
}

export const PaymentMethodSelection = () => (
    <MethodSelection setValue={() => null} onSubmit={(e) => e.preventDefault()} googleAvailable={true} appleAvailable={true} hasCredits={true} >

    </MethodSelection>
)