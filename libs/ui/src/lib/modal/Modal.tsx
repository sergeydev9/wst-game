import Modal from 'react-modal';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';

const modalStyles = {
    content: {
        zIndex: 5,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: 'min-content',
        width: 'min-content',
        padding: 0,
        borderRadius: '1.5rem',
        maxWidth: '42rem',
        backgroundColor: '#FBFBFE'
    }
}

const overlayClassName = "bg-opacity-60 bg-black fixed top-0 left-0 right-0 bottom-0"

export interface ModalProps extends Modal.Props {
    isOpen: boolean;
    onRequestClose: () => void;
}


const WstModal: React.FC<ModalProps> = ({ children, onRequestClose, ...rest }) => {
    return (
        <Modal overlayClassName={overlayClassName} {...rest} style={modalStyles} >
            <GrFormClose className="absolute right-8 top-11 text-4xl font-black cursor-pointer" onClick={onRequestClose} />
            {children}
        </Modal>
    )
}

export default WstModal;