import { useEffect, useState, useCallback, useMemo } from 'react';
import { PaymentIntent, PaymentRequest, StripeCardElement } from '@stripe/stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CardElement, PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Title1 } from '@whosaidtrue/ui'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import cards from '../../../assets/US_standard.webp';
import { selectCartDeck, clearCart } from '../../cart/cartSlice';
import { setFullModal, showError } from '../modalSlice';
import { setGameDeck } from '../../game/gameSlice';
import { api } from '../../../api';
import { useHistory } from 'react-router';

const Checkout: React.FC = () => {
    const stripe = useStripe();
    const history = useHistory();
    const elements = useElements();
    const [error, setError] = useState('');
    const [price, setPrice] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
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




        //     const paymentRequest = stripe.paymentRequest({
        //         currency: 'usd',
        //         country: 'US',
        //         displayItems: [
        //             {
        //                 amount: price,
        //                 label: deck.name
        //             }
        //         ],
        //         total: {
        //             amount: price,
        //             label: 'Total'
        //         },
        //         requestPayerEmail: true,
        //         requestShipping: false
        //     });


        //     // Once a payment method is selected
        //     paymentRequest.on('paymentmethod', async (ev) => {

        //         if (!clientSecret) {
        //             ev.complete('fail');
        //             return;
        //         }

        //         const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        //             clientSecret,
        //             { payment_method: ev.paymentMethod.id },
        //             { handleActions: false }
        //         );

        //         if (confirmError) {
        //             dispatch(showError(confirmError))
        //             ev.complete('fail');
        //         } else {
        //             ev.complete('success');

        //             // some cards may require additional confirmation
        //             if (paymentIntent?.status === "requires_action") {

        //                 const { error } = await stripe.confirmCardPayment(clientSecret);
        //                 if (error) {
        //                     dispatch(showError('Payment Failed. Please enter payment information'))
        //                 } else {
        //                     success()
        //                 }
        //             } else {
        //                 success()
        //             }
        //         }
        //     });

        //     // if user has google pay or apple pay enabled,
        //     // show the payment request button.
        //     paymentRequest.canMakePayment().then(result => {
        //         if (result?.googlePay || result?.applePay) {
        //             setPaymentRequest(paymentRequest)
        //         }
        //     })




    }, [dispatch, deck])

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

    const handleChange = async (event: any) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setError(event.error ? event.error.message : "");
    };


    return (
        <form onSubmit={handleSubmit}>
            <Title1 className="mb-10 text-center mt-1">Enter Credit Card Information</Title1>
            {/* {paymentRequest && <PaymentRequestButtonElement options={{
                paymentRequest,
                style: {
                    paymentRequestButton: {
                        theme: 'light-outline'
                    }
                }
            }} />} */}
            <img src={cards} alt='credit card logos' className="mb-16 mt-8 w-2/3 mx-auto" />
            <CardElement onChange={handleChange} options={{
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
            <Button type="submit" disabled={!stripe || processing || error !== ''}>
                Pay {deck.purchase_price}
            </Button>
            <PayPalButtons
                className="mt-6 select-none"
                style={{
                    color: 'white',
                    shape: 'pill',
                    layout: 'horizontal',
                    label: 'paypal'
                }} />
        </form>
    )
}

export default Checkout;