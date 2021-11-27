import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { api } from '../../api';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCartDeck, clearCart } from './cartSlice';
import { setFullModal, showError } from '../modal/modalSlice';
import { setGameDeck } from '../game/gameSlice';
import { selectId, selectIsGuest } from '../auth/authSlice';

const PayPalButton: React.FC<React.HtmlHTMLAttributes<HTMLButtonElement>> = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const deck = useAppSelector(selectCartDeck);
    const userId = useAppSelector(selectId);
    const isGuest = useAppSelector(selectIsGuest);

    useEffect(() => {

        // if store is missing any of this component's requirements, close the modal
        if (!deck || !deck.id || !userId || isGuest) {
            dispatch(clearCart())
            dispatch(setFullModal(''))
        }

    }, [deck, userId, isGuest, dispatch])

    // on successful purchase
    const success = () => {
        dispatch(setFullModal(''))
        dispatch(setGameDeck(deck))
        dispatch(clearCart())
        history.push('/purchase-success')
    }


    return (
        <PayPalButtons
            createOrder={(_, actions) => {
                const priceAsString = deck.purchase_price.replace(/[^0-9-.]/g, "")
                return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [{
                        custom_id: `${userId}`,
                        amount: {
                            currency_code: 'USD',
                            value: priceAsString,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: priceAsString
                                }
                            }
                        },
                        items: [{
                            category: 'DIGITAL_GOODS',
                            name: deck.name,
                            sku: `${deck.id}`,
                            quantity: '1',
                            unit_amount: { currency_code: 'USD', value: priceAsString }
                        }]
                    }],
                    application_context: {
                        user_action: 'PAY_NOW',
                        brand_name: 'Who Said True?',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            }}
            onApprove={(data) => {
                return api.post('/purchase/capture-paypal', { orderID: data.orderID, deckId: deck.id })
                    .then(() => {
                        success()
                    }).catch(e => {
                        const parsed = JSON.parse(e.response.data)

                        if (parsed.details[0]?.issue === 'INSTRUMENT_DECLINED') {
                            dispatch(showError('Payment declined'))
                            return
                        }
                        dispatch(showError('An error occured while processing payment.'))
                        return
                    })
            }}
            style={{
                color: 'white',
                shape: 'pill',
                height: 55,
                layout: 'horizontal',
                label: 'paypal',
                tagline: false
            }} />
    )
}

export default PayPalButton;