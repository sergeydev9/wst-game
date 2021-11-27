import { useState, useCallback, useEffect, useMemo } from 'react';
import tw from 'tailwind-styled-components';
import { PaymentRequest } from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js'
import { PaymentMethodSelect, Button, ModalContent } from '@whosaidtrue/ui';
import { api } from '../../../api';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { showError } from '../modalSlice'
import { setFullModal } from '../modalSlice';
import { selectIsGuest, selectDeckCredits } from '../../auth/authSlice';
import { selectCartDeck, clearCart, selectPriceInCents, setClientSecret, selectClientSecret } from '../../cart/cartSlice';
import PaymentRequestButton from '../../cart/PaymentRequestButton';
import PayPalButton from '../../cart/PayPalButton';
import { CheckoutRadioValue } from '@whosaidtrue/app-interfaces';

const ButtonContainer = tw.div`
    w-full
    mb-10
    h-min
`;

/**
 * Modal for selecting a payment processor.
 *
 * Instead of conditionally rendering the button components,
 * the general idea here is to place the buttonsinside contaner divs and hide those.
 *
 * These tricks are used to cut back on the number of times the buttons re-render.
 *
 * Without this trick, the components with a longer rendering time (e.g. the PayPal button)
 * would block the app for too long, and make this component unusable.
 */
const ChoosePaymentMethod: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const dispatch = useAppDispatch();
    const stripe = useStripe();
    const deck = useAppSelector(selectCartDeck)
    const credits = useAppSelector(selectDeckCredits)
    const isGuest = useAppSelector(selectIsGuest);
    const price = useAppSelector(selectPriceInCents);
    const clientSecret = useAppSelector(selectClientSecret);

    const [hasGpay, setHasGpay] = useState(false);
    const [hasApplePay, setHasApplePay] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
    const [method, setMethod] = useState<CheckoutRadioValue | ''>('');

    useEffect(() => {

        // if a guest somehow manages to open this modal
        if (isGuest) {
            dispatch(clearCart());
            dispatch(setFullModal(''))
            return;
        }

        if (!deck) {
            dispatch(setFullModal(''))
            return;
        }


        if (!clientSecret) {
            // create a payment intent as soon as user opens modal.
            api.post('/purchase/create-payment-intent', { deckId: deck.id }).then(response => {
                dispatch(setClientSecret(response.data.clientSecret));
            }).catch(e => {
                dispatch(showError('Oops, something went wrong!'))
                dispatch(setFullModal(''));
            })
        }


        if (stripe && !paymentRequest) {
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                displayItems: [
                    {
                        amount: price,
                        label: deck.name
                    },
                ],
                total: {
                    label: 'Total',
                    amount: price,
                },
                requestPayerEmail: true,
                requestShipping: false,
                requestPayerName: true // apple pay wants this
            });

            // check if apple pay or google pay are available
            pr.canMakePayment().then(result => {
                if (result && result.applePay) {
                    setHasApplePay(true);
                }

                if (result && result.googlePay) {
                    setHasGpay(true);
                }

                if (result) {
                    setPaymentRequest(pr)
                }
            })
        }
    }, [stripe, deck, dispatch, price, isGuest, clientSecret, paymentRequest])

    // saves the value of the selected option to component state
    const onValueChange = useCallback((value: CheckoutRadioValue) => {
        setMethod(value)
    }, [setMethod])


    // buy with credit card
    const openCardCheckout = () => {
        dispatch(setFullModal('cardCheckout'))
    }

    // buy with free deck credits
    const openCreditCheckout = () => {
        dispatch(setFullModal('freeCreditPurchase'));
    }

    // DEV_NOTE: The paypal button automatically adds a bit of space at the bottom. Negative
    // margin reverses this.
    return (<ModalContent $narrow>
        <PaymentMethodSelect
            showFreeCredit={credits > 0}
            showApplePay={hasApplePay}
            showGpay={hasGpay}
            setValue={onValueChange} />

        {/* Buttons */}
        <ButtonContainer>
            {/* free deck credits */}
            <div className={method !== 'deckCredit' ? 'hidden' : ''}>
                <Button type="button" className="w-full" onClick={openCreditCheckout}>Continue</Button>
            </div>

            {/* Google Pay and Apple Pay */}
            <div className={(hasApplePay || hasGpay) && (method === 'googlePay' || method === 'applePay') ? '' : 'hidden'}>
                {paymentRequest && <PaymentRequestButton
                    clientSecret={clientSecret}
                    paymentRequest={paymentRequest}
                    deck={deck} />}
            </div>
            {/* paypal */}
            <div className={method !== 'payPal' ? 'hidden' : '-mb-2'}>
                <PayPalButton />
            </div>

            {/* Credit Card */}
            <div className={method !== 'card' ? 'hidden' : ''}>
                <Button type="button" className="w-full" onClick={openCardCheckout}>Continue</Button>
            </div>

            {/* Disabled */}
            <div className={method ? 'hidden' : 'block bg-white opacity-50'}>
                <Button disabled type="button" className="w-full">Please choose a payment method</Button>
            </div>
        </ButtonContainer>
    </ModalContent>
    );
};

export default ChoosePaymentMethod;