import { SecurityCodeDigit as Digit } from '@whosaidtrue/ui';

export interface SecurityCodeDigitProps extends React.InputHTMLAttributes<HTMLInputElement> {
    $hasError?: boolean
}

interface DigitProps extends SecurityCodeDigitProps {
    forwardRef: React.Ref<HTMLInputElement>
}

// need to make this component to pass the ref along
const SecurityCodeDigit: React.FC<DigitProps> = ({ forwardRef, ...props }) => (
    <Digit {...props} ref={forwardRef} type="text" maxLength={1} size={1} min={0} max={9} pattern="[0-9]{1}" />
)

export default SecurityCodeDigit;