import { useEffect, useState } from 'react';
import { PaymentIntent, PaymentRequest } from '@stripe/stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CardElement, PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Title1 } from '@whosaidtrue/ui'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import cards from '../../../assets/US_standard.webp';
import { selectCartDeck, clearCart } from '../../cart/cartSlice';
import { setFullModal } from '../modalSlice';

const Checkout: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [price, setPrice] = useState(0);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

    const dispatch = useAppDispatch();
    const deck = useAppSelector(selectCartDeck)

    useEffect(() => {

        // Price is a string with '$' because it's saved as postgres money type.
        // parse to float here so it can be used in stripe.
        // Also remove period. 2.00 needs to become 200, because
        // Stripe interprets 2 as $0.02
        setPrice(parseFloat(deck.purchase_price.replace(/[^0-9]/g, "")));

        if (stripe && elements && price) {
            const paymentRequest = stripe.paymentRequest({
                currency: 'usd',
                country: 'US',
                displayItems: [
                    {
                        amount: price,
                        label: deck.name
                    }
                ],
                total: {
                    amount: price,
                    label: 'Total'
                },
                requestPayerEmail: true,
                requestShipping: false
            });

            paymentRequest.canMakePayment().then(result => {
                if (result?.googlePay || result?.applePay) {
                    setPaymentRequest(paymentRequest)
                }
            })

            paymentRequest.on('paymentmethod', async (ev) => {

                if (clientSecret) {

                    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                        clientSecret,
                        { payment_method: ev.paymentMethod.id },
                        { handleActions: false }
                    );

                    if (confirmError) {
                        // Report to the browser that the payment failed, prompting it to
                        // re-show the payment interface, or show an error message and close
                        // the payment interface.
                        ev.complete('fail');
                    } else {
                        // Report to the browser that the confirmation was successful, prompting
                        // it to close the browser payment method collection interface.
                        ev.complete('success');
                        // Check if the PaymentIntent requires any actions and if so let Stripe.js
                        // handle the flow. If using an API version older than "2019-02-11"
                        // instead check for: `paymentIntent.status === "requires_source_action"`.
                        if (paymentIntent?.status === "requires_action") {
                            // Let Stripe.js handle the rest of the payment flow.
                            const { error } = await stripe.confirmCardPayment(clientSecret);
                            if (error) {
                                // The payment failed -- ask your customer for a new payment method.
                            } else {
                                // The payment has succeeded.
                            }
                        } else {
                            // The payment has succeeded.
                        }
                    }
                }
            });
        }

    }, [deck, stripe, elements, dispatch, clientSecret, price])

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
            {paymentRequest && <PaymentRequestButtonElement options={{
                paymentRequest,
                style: {
                    paymentRequestButton: {
                        theme: 'light-outline'
                    }
                }
            }} />}
            <img src={cards} alt='credit card logos' className="mb-16 mt-8 w-2/3 mx-auto" />
            <CardElement options={{
                classes: {
                    base: "px-3 py-4 form-input border-purple-base placeholder-basic-gray rounded-xl bg-purple-subtle-fill mb-10",
                    invalid: "bg-red-subtle-fill border-red-base shadow-error"
                }
            }} />
            <Button type="submit" disabled={!stripe}>
                Pay {deck.purchase_price}
            </Button>
            <PayPalButtons className="mt-6 select-none" style={{ color: 'white', shape: 'pill', layout: 'horizontal', label: 'paypal' }} />
        </form>
    )
}

export default Checkout;