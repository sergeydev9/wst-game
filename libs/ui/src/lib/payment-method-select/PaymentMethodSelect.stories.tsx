import MethodSelection from './PaymentMethodSelect';
import RadioInput from '../radio-input/RadioInput';

export default {
    component: MethodSelection,
    title: 'Misc/Payment Method Selection'
}

export const PaymentMethodSelection = () => (
    <MethodSelection submitCallback={(e) => e.preventDefault()} googleAvailable={true} appleAvailable={true} hasCredits={true} >

    </MethodSelection>
)