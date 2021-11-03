import { Button, ModalContent } from '@whosaidtrue/ui';
import { selectRequestedCreditsFor } from '../..';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setFullModal } from '../modalSlice';

const CheckYourEmail = () => {
    const dispatch = useAppDispatch();
    const email = useAppSelector(selectRequestedCreditsFor);

    return (
        <ModalContent>
            <h3 className="font-black text-4xl">Check Your Email</h3>
            <p className="text-xl font-medium text-center">We’ve sent your FREE Question Deck link to {email}. If you don’t see it in the next couple of minutes, check your spam folder.</p>
            <Button type="button" onClick={() => dispatch(setFullModal(''))}>OK, Cool!</Button>
        </ModalContent>
    )
}

export default CheckYourEmail;