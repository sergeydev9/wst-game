import Modal from 'react-modal';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';

export interface ModalProps extends Modal.Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const WstModal: React.FC<ModalProps> = ({ children, onRequestClose, ...rest }) => {
    return (
        <Modal onRequestClose={onRequestClose} {...rest} >
            <GrFormClose className="absolute right-6 top-8 text-4xl z-10 font-black cursor-pointer" onClick={onRequestClose} />
            {children}
        </Modal>
    )
}

export default WstModal;