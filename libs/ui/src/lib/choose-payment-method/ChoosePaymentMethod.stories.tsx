import { Story, Meta } from '@storybook/react';
import MethodSelection, { PaymentMethodSelectProps } from './ChoosePaymentMethod';

export default {
    component: MethodSelection,
    title: 'Checkout/Choose Payment Method',
    argTypes: {
        showGpay: {
            name: 'showGpay',
            type: 'boolean',
            defaultValue: true
        },
        showApplePay: {
            name: 'showApplePay',
            type: 'boolean',
            defaultValue: true
        }
    }
} as Meta

const Template: Story<PaymentMethodSelectProps> = (args) => (
    <MethodSelection {...args} onSubmit={(v) => console.log(v)}>
    </MethodSelection>
)

export const ChoosePaymentMethod = Template.bind({});
