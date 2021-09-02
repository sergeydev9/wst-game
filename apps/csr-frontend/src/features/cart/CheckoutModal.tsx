import { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentMethodSelect } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectDeckCredits } from '../auth/authSlice';
import { setFullModal } from '../modal/modalSlice';
import { getSelectedDeck } from '../decks/deckSlice';


const CheckoutModal: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const [method, setMethod] = useState('');
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
    const [apple, setApple] = useState(false);
    const [google, setGoogle] = useState(false);
    const stripe = useStripe()
    const credits = useAppSelector(selectDeckCredits);
    const deck = useAppSelector(getSelectedDeck)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (stripe) {
            const paymentRequest = stripe.paymentRequest({
                currency: 'usd',
                country: 'US',
                total: {
                    amount: parseFloat(deck.purchase_price.replace(/[^0-9.-]+/g, "")),
                    label: 'Price'
                },
                requestPayerEmail: true,
                requestShipping: false
            })

            paymentRequest.canMakePayment().then(result => {
                if (result) {
                    if (result.applePay) {
                        setApple(true)
                    }

                    if (result.googlePay) {
                        setGoogle(true)
                    }
                }
            })

        }
    }, [method, stripe, deck])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        switch (method) {
            case 'creditCard':
                dispatch(setFullModal('cardPurchase'));
                return
            case 'googlePay':
                dispatch(setFullModal('googlePay'))
                return
            case 'deckCredit':
                dispatch(setFullModal('deckCredit'))
                return
            default:
                dispatch(setFullModal(''))
                return
        }

    }

    return (
        <PaymentMethodSelect
            className="w-screen"
            setValue={setMethod}
            onSubmit={onSubmit}
            hasCredits={credits > 0}
            appleAvailable={true}
            googleAvailable={true} />
    );
};

export default CheckoutModal