import ModalContent from '../../containers/ModalContent';
import Button from '../../button/Button';
import { Title1, BodyMedium } from '../../typography/Typography';

export interface ConfirmModalProps {
    confirm: () => void;
    cancel: () => void;
    header: string;
    subHeader: string;
    confirmationText?: string;
    cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ confirm, cancel, header, subHeader, confirmationText, cancelText }) => {

    return (
        <ModalContent className="text-center">
            <Title1 className="text-center sm:px-4 md:px-10">{header}</Title1>
            <BodyMedium className="text-center sm:px-8 md:px-16" >{subHeader}</BodyMedium>
            <div className="md:w-2/5 flex flex-col gap-4 w-full px-3 sm:p-0 sm:w-3/5 mx-auto">
                <Button onClick={confirm} type="button">{confirmationText || 'Yes'}</Button>
                <Button className="w-full" onClick={cancel} type="button" $secondary>{cancelText || 'No'}</Button>
            </div>
        </ModalContent>
    )
}

export default ConfirmModal