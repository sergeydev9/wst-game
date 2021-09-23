import MethodSelection from './PaymentMethodSelect';

export default {
    component: MethodSelection,
    title: 'Checkout/Payment Method Selection'
}

export const PaymentMethodSelection = () => (
    <MethodSelection setValue={() => null} onSubmit={(e) => e.preventDefault()}>
    </MethodSelection>
)