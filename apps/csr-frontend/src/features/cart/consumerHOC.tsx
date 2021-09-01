import { ElementsConsumer } from '@stripe/react-stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';


export interface ConsumerProps {
    elements: StripeElements | null;
    stripe: Stripe | null;
}

const consumer = (Component: React.FC<ConsumerProps>) => {
    return (
        <ElementsConsumer>
            {({ elements, stripe }) => (
                <Component elements={elements} stripe={stripe} />
            )}
        </ElementsConsumer>
    )
}

export default consumer