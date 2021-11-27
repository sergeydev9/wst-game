import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { PaymentRequest } from '@stripe/stripe-js';
import { useAppDispatch } from '../../app/hooks';
import { setGameDeck } from '../game/gameSlice';
import { setFullModal, showError } from '../modal/modalSlice';
import { Deck } from '@whosaidtrue/app-interfaces';

export interface PaymentRequestButtonProps {
    clientSecret: string;
    paymentRequest: PaymentRequest;
    deck: Deck;
}

const PaymentRequestButton: React.FC<PaymentRequestButtonProps> = ({ clientSecret, paymentRequest, deck }) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const stripe = useStripe();

    // on successful purchase
    const success = useCallback(() => {
        dispatch(setFullModal(''))
        dispatch(setGameDeck(deck))
        history.push('/purchase-success')
    }, [history, dispatch, deck])


    useEffect(() => {

        if (stripe) {
            // Once a payment method is selected
            paymentRequest.on('paymentmethod', async (ev) => {

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
        }
    }, [paymentRequest, stripe, clientSecret, dispatch, success])

    return <PaymentRequestButtonElement options={{
        paymentRequest,
        style: {
            paymentRequestButton: {
                theme: 'light-outline',
                height: '55px'
            }
        }
    }} />
}

export default PaymentRequestButton;