import { Link } from 'react-router-dom';
import { Headline } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { setFullModal } from '../modal/modalSlice';
import { clearCart } from '../cart/cartSlice';


/**
 * Displays a message saying that an email address is already in use
 */
const EmailInUse: React.FC = () => {
    const dispatch = useAppDispatch();

    const clearCartAndDetails = () => {
        dispatch(setFullModal(''))
        dispatch(clearCart())
    }

    const linkClass = "text-basic-gray underline cursor-pointer mt-4";
    return (
        <Headline data-cy="email-in-use" className="mt-2" >
            That email address is already in use. If you forgot your password, or if you previously hosted a game as a guest, <Link
                className={linkClass}
                onClick={clearCartAndDetails}
                to="/reset/send-email" data-cy="in-use-reset-link">click here</Link> to reset your password.
        </Headline>
    )
}

export default EmailInUse;