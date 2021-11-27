import Box from './box/Box';

export interface ModalContentProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    $narrow?: boolean
}

const ModalContent: React.FC<ModalContentProps> = ({ children, $narrow }) => {
    return <Box boxstyle="white" className={`${$narrow ? 'w-28rem' : 'sm:w-28rem md:w-40rem'} max-w-full text-basic-black gap-10 md:px-8 px-2 sm:px-4 pt-7 pb-14 outline-none`}>
        {children}
    </Box>
}

export default ModalContent