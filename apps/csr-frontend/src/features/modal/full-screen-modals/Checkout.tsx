import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Title1, ModalContent } from '@whosaidtrue/ui'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import cards from '../../../assets/US_standard.webp';
import PaymentRequestButton from './PaymentRequestButton';
import { selectCartDeck, clearCart } from '../../cart/cartSlice';
import { setFullModal, showError } from '../modalSlice';
import { setGameDeck } from '../../game/gameSlice';
import { api } from '../../../api';

const Checkout: React.FC = () => {
    const stripe = useStripe();
    const history = useHistory();
    const elements = useElements();
    const [ready, setReady] = useState(false);
    const [price, setPrice] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const deck = useAppSelector(selectCartDeck);


    // on successful purchase
    const success = useCallback(() => {
        dispatch(setFullModal(''))
        dispatch(setGameDeck(deck))
        history.push('/purchase-success')
    }, [history, dispatch, deck])

    useEffect(() => {

        // Price is a string with '$' because it's saved as postgres money type.
        // parse to float here so it can be used in stripe.
        // Also remove period. 2.00 needs to become 200, because
        // Stripe interprets 2 as $0.02
        setPrice(parseFloat(deck.purchase_price.replace(/[^0-9]/g, "")));

        // create a payment intent as soon as user opens modal.
        api.post('/purchase/create-payment-intent', { deckId: deck.id }).then(response => {
            setClientSecret(response.data.clientSecret);
        }).catch(e => {
            dispatch(showError('Oops, something went wrong!'))
            dispatch(setFullModal(''));
        })

        // listen to card element changes to enable button
        if (elements) {
            const cardElement = elements.getElement(CardElement);
            cardElement?.on('change', (e) => {
                e.complete ? setReady(true) : setReady(false)
            })
        }


    }, [dispatch, deck, elements])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement || !clientSecret) {
            return
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            }
        });

        if (error) {
            console.error(error)
            dispatch(showError(error.message));
            dispatch(setFullModal(''))
            dispatch(clearCart())
        } else {
            if (paymentIntent?.status === "requires_action") {

                const { error } = await stripe.confirmCardPayment(clientSecret);
                if (error) {
                    dispatch(showError('Payment Failed. Please enter payment information'))
                } else {
                    success()
                }
            } else {
                success()
            }
        }

    };


    return (
        <ModalContent $narrow>
            <form onSubmit={handleSubmit}>
                <Title1 className="mb-10 text-center mt-1">Enter Credit Card Information</Title1>
                {clientSecret && <PaymentRequestButton clientSecret={clientSecret} deck={deck} price={price} />}
                <img src={cards} alt='credit card logos' className="mb-16 mt-8 w-2/3 mx-auto" />
                <CardElement options={{
                    hidePostalCode: true,
                    classes: {
                        base: `px-3
                    py-4
                    form-input
                    border-purple-base
                    placeholder-basic-gray
                    rounded-xl
                    bg-purple-subtle-fill
                    mb-10
                    `,
                        invalid: "bg-red-subtle-fill border-red-base shadow-error"

                    }
                }} />
                <div className={`${!ready && 'opacity-40 pointer-events-none'}`}>
                    <Button type="submit" disabled={!ready}>
                        Pay {deck.purchase_price}
                    </Button>
                </div>

                <PayPalButtons
                    className="mt-6 select-none"
                    style={{
                        color: 'white',
                        shape: 'pill',
                        layout: 'horizontal',
                        label: 'paypal'
                    }} />
            </form>
        </ModalContent>

    )
}

export default Checkout;