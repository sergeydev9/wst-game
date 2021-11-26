import tw from 'tailwind-styled-components';
import { BsCreditCard } from '@react-icons/all-files/bs/BsCreditCard';
import RadioInput from '../inputs/radio-input/RadioInput';
import { Title1 } from '../typography/Typography';
import ModalContent from '../containers/ModalContent';
import WSTlogo from '../assets/wst_logo_51x51.png';
import PayPalMark from '../assets/pp_cc_mark_37x23.jpg';
import ApplePayMark from '../assets/Apple_Pay_Mark.svg';
import GooglePayMark from '../assets/gpay_mark.svg';


export interface PaymentMethodSelectProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    setValue: (v: string) => void;
    showGpay?: boolean;
    showApplePay?: boolean;
}

const InputGroup = tw.div`
flex
flex-row
gap-4
justify-start
items-center
`
const Label = tw.label`
flex
gap-4
items-center
text-title-3
font-bold
select-none
`
const iconClassName = "mx-2 w-12 h-12"

/**
 * Radio select options for choosing a payment processing option.
 *
 * The children of this component should be the vendor speccific button.
 *
 * This component is used to select which child to display.
 */
const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ setValue, children, showGpay, showApplePay }) => {

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value)
    }

    return (<ModalContent>
        <Title1 className="text-center">Payment Options</Title1>
        <form>
            <fieldset className="flex flex-col px-4 sm:p-0 gap-10 mb-6">
                {/* Free Credit */}
                <InputGroup>
                    <RadioInput id="deckCredit" name="paymentMethod" value="deckCredit" type="radio" onChange={onChange} />
                    <Label htmlFor="deckCredit">Free Deck Credit<img src={WSTlogo} className={iconClassName} alt="wst-logo" /></Label>
                </InputGroup>

                {/* Apple Pay */}
                {showApplePay && <InputGroup>
                    <RadioInput id="applePay" name="paymentMethod" value="applePay" type="radio" onChange={onChange} />
                    <Label htmlFor="applePay">Buy with <img src={ApplePayMark} width="56px" height="35px" className="mx-2" alt="Apple Pay Logo" /> </Label>
                </InputGroup>}

                {/* Google Pay */}
                {showGpay && <InputGroup>
                    <RadioInput id="googlePay" name="paymentMethod" value="googlePay" type="radio" onChange={onChange} />
                    <Label htmlFor="googlePay">Buy with <img src={GooglePayMark} width="56px" height="35px" className="mx-2" alt="Google Pay Logo" /> </Label>
                </InputGroup>}

                {/* PayPal */}
                <InputGroup>
                    <RadioInput id="payPal" name="paymentMethod" value="payPal" type="radio" onChange={onChange} />
                    <Label htmlFor="payPal">Buy with <img src={PayPalMark} width="56px" height="35px" className="mx-2" alt="PayPal Logo" /></Label>
                </InputGroup>

                {/* Card */}
                <InputGroup >
                    <RadioInput id="card" name="paymentMethod" value="card" type="radio" onChange={onChange} />
                    <Label htmlFor="card">Credit Card <BsCreditCard className={iconClassName} type="icon" /></Label>
                </InputGroup>
            </fieldset>
            {children}
        </form>
    </ModalContent>
    )
}

export default PaymentMethodSelect