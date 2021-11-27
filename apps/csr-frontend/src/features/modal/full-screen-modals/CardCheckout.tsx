import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { css } from "@emotion/react";
import DotLoader from 'react-spinners/DotLoader';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Title1, ModalContent } from '@whosaidtrue/ui'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import cards from '../../../assets/US_standard.webp';
import { selectCartDeck, clearCart, selectClientSecret } from '../../cart/cartSlice';
import { setFullModal, showError } from '../modalSlice';
import { setGameDeck } from '../../game/gameSlice';
import { selectIsGuest } from '../../auth/authSlice';

const Checkout: React.FC = () => {
    const dispatch = useAppDispatch();
    const stripe = useStripe();
    const history = useHistory();
    const elements = useElements();
    const [ready, setReady] = useState(false);
    const [processing, setProcessing] = useState(false);
    const deck = useAppSelector(selectCartDeck);
    const clientSecret = useAppSelector(selectClientSecret);
    const isGuest = useAppSelector(selectIsGuest);

    // on successful purchase
    const success = () => {
        dispatch(setFullModal(''))
        dispatch(setGameDeck(deck))
        history.push('/purchase-success')
    }

    useEffect(() => {

        if (!deck || !clientSecret || isGuest) {
            dispatch(clearCart());
            dispatch(setFullModal(''));
        }

        // listen to card element changes to enable button
        if (elements) {
            const cardElement = elements.getElement(CardElement);
            cardElement?.on('change', (e) => {
                e.complete ? setReady(true) : setReady(false)
            })
        }
    }, [dispatch, deck, elements, clientSecret, isGuest])

    // SUBMIT BUTTON
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
            return;
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

    // override some of the spinner's default styles
    const loaderOverride = css`
        position: absolute;
        top: 40%;
        left: 0;
        right: 0;
        select: none;
        margin-left: auto;
        margin-right: auto;
        width: 75px;
    `

    return (
        <ModalContent>
            {/* spinner during processing */}
            {(processing && <>
                <h3 className="text-2xl mt-24 text-center font-semibold">Please wait while payment is processing...</h3>
                <DotLoader color="#F2AB3C" css={loaderOverride} />
            </>)}

            {/* card form */}
            <form className={`${processing ? 'invisible' : ''} py-8`} onSubmit={handleSubmit}>
                <Title1 className="mb-10 text-center mt-1">Checkout</Title1>
                <img src={cards} alt='credit card logos' className="mb-8 mt-16 w-1/4 mx-auto" />
                <CardElement options={{
                    hidePostalCode: false,
                    classes: {
                        base: `
                            px-3
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
                <div className={`${!ready ? 'opacity-40 pointer-events-none' : ''} w-full text-center`}>
                    <Button type="submit" disabled={!ready}>
                        Pay {deck.purchase_price}
                    </Button>
                </div>
            </form>
        </ModalContent>

    )
}

export default Checkout;