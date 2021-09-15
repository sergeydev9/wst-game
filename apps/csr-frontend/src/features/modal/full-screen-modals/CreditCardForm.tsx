import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Title1 } from '@whosaidtrue/ui'
import { useAppSelector } from '../../../app/hooks';
import { getSelectedDeck } from '../../decks/deckSlice';
import cards from '../../../assets/US_standard.webp';

const CreditCardForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const selectedDeck = useAppSelector(getSelectedDeck)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Title1 className="mb-10 text-center mt-1">Enter Credit Card Information</Title1>
            <img src={cards} alt='credit card logos' className="mb-16 w-2/3 mx-auto" />
            <CardElement options={{
                classes: {
                    base: "px-3 py-4 form-input border-purple-base placeholder-basic-gray rounded-xl bg-purple-subtle-fill mb-10",
                    invalid: "bg-red-subtle-fill border-red-base shadow-error"
                }
            }} />
            <Button type="submit" disabled={!stripe}>
                Pay {selectedDeck.purchase_price}
            </Button>
        </form>
    )
}
export default CreditCardForm