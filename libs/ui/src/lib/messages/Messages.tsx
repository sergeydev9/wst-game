import { CgCloseO } from '@react-icons/all-files/cg/CgCloseO'
import errorImage from './error.png'

export interface FlashMessageModalProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    closeFn?: () => void;
    error?: boolean;

}

const FlashMessageModal: React.FC<FlashMessageModalProps> = ({ children, closeFn, error }) => {
    const className = `
        ${error ? 'bg-red-subtle-fill text-red-base border border-red-base rounded-xl' : 'rounded-full bg-white'}
        shadow-md
        py-4
        px-7
        text-center
        w-max
        text-headline
        font-bold
        flex
        flex-row
        gap-4
        items-center
    `
    return (
        <div className={className}>
            {error && <img src={errorImage} width="25px" height="25px" alt="error emoji" />}
            {children}
            {closeFn && <CgCloseO type="icon" aria-label="close icon" className="cursor-pointer text-2xl" onClick={closeFn} />}
        </div>
    )
}

export default FlashMessageModal;