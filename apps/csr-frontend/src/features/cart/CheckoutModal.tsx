import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { PaymentMethodSelect } from '@whosaidtrue/ui';
import { } from './cartSlice';
import React, { FormEvent } from 'react';


const CheckoutModal: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const dispatch = useAppDispatch();

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(e)
    }

    return (
        <PaymentMethodSelect className="w-screen" submitCallback={onSubmit} />
    );
};

export default CheckoutModal