import { CgCloseO } from '@react-icons/all-files/cg/CgCloseO'
import errorImage from './error.png'

export interface MessageModalProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    closeFn?: () => void;
    error?: boolean;
    success?: boolean;
}

const FlashMessageModal: React.FC<MessageModalProps> = ({ children, closeFn, error, success }) => {
    const className = `
        ${error ? 'bg-red-subtle-fill text-red-base border border-red-base rounded-xl' : 'rounded-full bg-white'}
        ${success ? `bg-green-subtle-fill text-green-base border border-green-base rounded-full` : 'rounded-full bg-white'}
        shadow-md
        py-4
        px-7
        text-center
        w-full
        sm:w-max
        text-headline
        font-bold
        flex
        flex-row
        gap-4
        items-center
    `
    return (
        <div data-cy="message-modal" className={className}>
            {error && <img src={errorImage} width="25px" height="25px" alt="error emoji" />}
            {children}
            {closeFn && <CgCloseO type="icon" aria-label="close icon" className="cursor-pointer text-4xl xs:text-3xl sm:text-2xl" onClick={closeFn} />}
        </div>
    )
}

export default FlashMessageModal;