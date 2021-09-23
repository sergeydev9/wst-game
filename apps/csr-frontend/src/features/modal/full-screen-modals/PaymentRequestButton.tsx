import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { PaymentRequest } from '@stripe/stripe-js';
import { useAppDispatch } from '../../../app/hooks';
import { setGameDeck } from '../../game/gameSlice';
import { setFullModal, showError } from '../modalSlice';
import { Deck } from '@whosaidtrue/app-interfaces';



export interface PaymentRequestButtonProps {
    clientSecret: string;
    price: number;
    deck: Deck;
}

const PaymentRequestButton: React.FC<PaymentRequestButtonProps> = ({ clientSecret, price, deck }) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const stripe = useStripe();
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

    // on successful purchase
    const success = useCallback(() => {
        dispatch(setFullModal(''))
        dispatch(setGameDeck(deck))
        history.push('/purchase-success')
    }, [history, dispatch, deck])


    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
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
                requestShipping: false,
                requestPayerName: true // apple pay wants this
            });


            // Once a payment method is selected
            pr.on('paymentmethod', async (ev) => {

                if (!clientSecret) {
                    ev.complete('fail');
                    return;
                }

                const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                    clientSecret,
                    { payment_method: ev.paymentMethod.id },
                    { handleActions: false }
                );

                if (confirmError) {
                    dispatch(showError(confirmError))
                    ev.complete('fail');
                } else {
                    ev.complete('success');

                    // some cards may require additional confirmation
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
            });

            // if user has google pay or apple pay enabled,
            // show the payment request button.
            pr.canMakePayment().then(result => {
                if (result?.googlePay || result?.applePay) {
                    setPaymentRequest(pr)
                }
            })
        }
    }, [stripe, clientSecret, deck, dispatch, price, success])

    return paymentRequest && <PaymentRequestButtonElement options={{
        paymentRequest,
        style: {
            paymentRequestButton: {
                theme: 'light-outline'
            }
        }
    }} />
}

export default PaymentRequestButton;