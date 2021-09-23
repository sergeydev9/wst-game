import tw from 'tailwind-styled-components';
import { BsCreditCard } from '@react-icons/all-files/bs/BsCreditCard';
import { ReactComponent as NavLogo } from '../assets/logo.svg';
import RadioInput from '../inputs/radio-input/RadioInput';
import { Title1, BodyMedium } from '../typography/Typography';
import Button from '../button/Button'
import ModalContent from '../containers/ModalContent';

export interface PaymentMethodSelectProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    onSubmit: React.FormEventHandler;
    setValue: (v: string) => void;
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

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ setValue, onSubmit }) => {

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value)
    }

    return (<ModalContent>
        <Title1 className="text-center">Choose your payment method:</Title1>
        <form onSubmit={onSubmit}>
            <fieldset className="flex flex-col px-4 sm:p-0 gap-6">
                <legend className="mb-8 text-center flex-nowrap"><BodyMedium>You have free deck credits available!</BodyMedium></legend>
                <InputGroup>
                    <RadioInput id="deckCredit" name="paymentMethod" value="deckCredit" type="radio" onChange={onChange} />
                    <Label htmlFor="deckCredit"><NavLogo className={iconClassName} type="icon" />Free Deck Credit</Label>
                </InputGroup>
                <InputGroup className="mb-6">
                    <RadioInput id="otherMethod" name="paymentMethod" value="otherMethod" type="radio" onChange={onChange} />
                    <Label htmlFor="otherMethod"><BsCreditCard className={iconClassName} type="icon" />Other</Label>
                </InputGroup>
                <Button type="submit">Continue to Checkout</Button>
            </fieldset>
        </form>
    </ModalContent>
    )
}

export default PaymentMethodSelect