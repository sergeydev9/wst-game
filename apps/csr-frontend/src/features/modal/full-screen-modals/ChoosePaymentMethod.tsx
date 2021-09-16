import { useState } from 'react';
import { PaymentMethodSelect } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../../app/hooks';
import { setFullModal } from '../modalSlice';
import { clearCart } from '../../cart/cartSlice';


const CheckoutModal: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const [method, setMethod] = useState('');
    const dispatch = useAppDispatch();


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        switch (method) {
            case 'otherMethod':
                dispatch(setFullModal('checkout'))
                return
            case 'deckCredit':
                dispatch(setFullModal('freeCreditPurchase'))
                return
            default:
                dispatch(clearCart())
                dispatch(setFullModal(''))
                return
        }

    }

    return (
        <PaymentMethodSelect
            setValue={setMethod}
            onSubmit={onSubmit}
        />
    );
};

export default CheckoutModal