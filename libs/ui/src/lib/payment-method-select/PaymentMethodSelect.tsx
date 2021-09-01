import tw from 'tailwind-styled-components';
import NoFlexBox from '../no-flex-box/NoFlexBox';
import { ReactComponent as NavLogo } from '../nav-logo/logo.svg';
import { ReactComponent as AppleMark } from './Apple_Pay_Mark.svg';
import { ReactComponent as GoogleMark } from './gpay_mark.svg';
import { ReactComponent as PayPal } from './PayPal.svg';
import RadioInput from '../radio-input/RadioInput';
import { Title1, BodyMedium } from '../typography/Typography';
import Button from '../button/Button'

export interface PaymentMethodSelectProps {
    submitCallback: React.FormEventHandler;
    appleAvailable?: boolean; // toggle display of apple pay option
    googleAvailable?: boolean; // toggle dispay of google pay option

}

const InputGroup = tw.div`
flex
flex-row
gap-4
justify-start
pl-8
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
    return (
        <NoFlexBox className="flex flex-col items-center gap-6" >
            <Title1>Checkout</Title1>
            <form onSubmit={submitCallback}>
                <fieldset className="flex flex-col gap-6">
                    <legend className="mb-6"><BodyMedium>Choose your payment method:</BodyMedium></legend>
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
                        <Label htmlFor="payPal"><PayPal className="mx-2 w-12 h-12 border-1 border-black" />PayPal</Label>
                    </InputGroup>


                    <Button type="submit">Continue to Checkout</Button>
                </fieldset>
            </form>
        </NoFlexBox>
    )
}

export default PaymentMethodSelect