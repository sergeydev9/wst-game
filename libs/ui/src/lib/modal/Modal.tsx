import Modal from 'react-modal';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';

export interface ModalProps extends Modal.Props {
    isOpen: boolean;
    hideClose?: boolean;
    onRequestClose: () => void;
}

/**
 * React modal component used to display all full screen modal components.
 */
const WstModal: React.FC<ModalProps> = ({ children, onRequestClose, hideClose, ...rest }) => {
    return (
        <Modal onRequestClose={onRequestClose} {...rest} >
            {!hideClose && <GrFormClose className="absolute top-4 right-4 text-4xl z-10 font-black cursor-pointer sm:top-6 sm:right-6" onClick={onRequestClose} />}
            {children}
        </Modal>
    )
}

export default WstModal;
