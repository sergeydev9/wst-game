import { CardElement, Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import consumer, { ConsumerProps } from './consumerHOC'

const CreditCardForm: React.FC<ConsumerProps> = ({ elements, stripe }) => {
    return (
        <form>

        </form>
    )
}
export default consumer(CreditCardForm)