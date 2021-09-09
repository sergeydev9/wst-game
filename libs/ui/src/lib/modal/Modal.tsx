import Modal from 'react-modal';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';

export interface ModalProps extends Modal.Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const WstModal: React.FC<ModalProps> = ({ children, onRequestClose, ...rest }) => {
    return (
        <Modal onRequestClose={onRequestClose} {...rest} >
            <GrFormClose className="absolute right-1 sm:right-6 sm:top-8 top-4 text-4xl z-10 font-black cursor-pointer" onClick={onRequestClose} />
            {children}
        </Modal>
    )
}

export default WstModal;