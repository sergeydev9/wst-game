import tw from 'tailwind-styled-components';
import { BsCreditCard } from '@react-icons/all-files/bs/BsCreditCard';
import NoFlexBox from '../no-flex-box/NoFlexBox';
import { ReactComponent as NavLogo } from '../nav-logo/logo.svg';
import { ReactComponent as AppleMark } from './Apple_Pay_Mark.svg';
import { ReactComponent as GoogleMark } from './gpay_mark.svg';
import { ReactComponent as PayPal } from './PayPal.svg';
import RadioInput from '../radio-input/RadioInput';
import { Title1, BodyMedium } from '../typography/Typography';
import Button from '../button/Button'

export interface PaymentMethodSelectProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    submitCallback: React.FormEventHandler;
    appleAvailable?: boolean; // toggle display of apple pay option
    googleAvailable?: boolean; // toggle dispay of google pay option

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
`
const iconClassName = "mx-2 w-12 h-12"

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ submitCallback, appleAvailable, googleAvailable }) => {
    return (<>
        <Title1 className="text-center mb-4">Checkout</Title1>
        <form onSubmit={submitCallback}>
            <fieldset className="flex flex-col gap-6">
                <legend className="mb-8 text-center flex-nowrap"><BodyMedium>Choose your payment method:</BodyMedium></legend>
                <InputGroup>
                    <RadioInput id="deckCredit" name="paymentMethod" value="deckCredit" type="radio" />
                    <Label htmlFor="deckCredit"><NavLogo className={iconClassName} />Free Deck Credit</Label>
                </InputGroup>
                {appleAvailable && (
                    <InputGroup>
                        <RadioInput id="applePay" name="paymentMethod" value="applePay" type="radio" />
                        <Label htmlFor="applePay"><AppleMark className={iconClassName} />Apple Pay</Label>
                    </InputGroup>
                )}
                {googleAvailable && (
                    <InputGroup>
                        <RadioInput id="googlePay" name="paymentMethod" value="googlePay" type="radio" />
                        <Label htmlFor="googlePay"><GoogleMark className={iconClassName} />Google Pay</Label>
                    </InputGroup>
                )}
                <InputGroup>
                    <RadioInput id="payPal" name="paymentMethod" value="payPal" type="radio" />
                    <Label htmlFor="payPal"><PayPal className={iconClassName} />PayPal</Label>
                </InputGroup>
                <InputGroup className="mb-6">
                    <RadioInput id="creditCard" name="paymentMethod" value="creditCard" type="radio" />
                    <Label htmlFor="creditCard"><BsCreditCard className={iconClassName} />Credit Card</Label>
                </InputGroup>
                <Button type="submit">Continue to Checkout</Button>
            </fieldset>
        </form>
    </>
    )
}

export default PaymentMethodSelect