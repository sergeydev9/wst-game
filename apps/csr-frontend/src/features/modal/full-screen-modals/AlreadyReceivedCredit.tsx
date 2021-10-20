import { Button, ModalContent } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../../app/hooks';
import { setFullModal } from '../modalSlice';

const CheckYourEmail = () => {
    const dispatch = useAppDispatch();

    return (
        <ModalContent>
            <h3 className="font-black text-4xl">Oops!</h3>
            <p className="text-xl font-medium text-center">That email address has already receieved a free Question Deck credit.</p>
            <Button type="button" className="w-2/3" onClick={() => dispatch(setFullModal(''))}>OK</Button>
        </ModalContent>
    )
}

export default CheckYourEmail;