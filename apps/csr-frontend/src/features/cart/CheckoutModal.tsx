import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { PaymentMethodSelect } from '@whosaidtrue/ui';
import { } from './cartSlice';
import { selectDeckCredits } from '../auth/authSlice';


const CheckoutModal: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const [method, setMethod] = useState('');
    const credits = useAppSelector(selectDeckCredits);

    const dispatch = useAppDispatch();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(method)

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