import Button from '../button/Button';
import CelebrationIcons from '../celebration-icons/CelebrationIcons';

export interface CreditAwardProps {
    numTotal: number;
    clickHandler: () => void;
}
const CreditAward: React.FC<CreditAwardProps> = ({ numTotal, clickHandler }) => {

    return (
        <div className="text-basic-black text-center select-none bg-purple-subtle-fill flex flex-col rounded-3xl w-full sm:w-96 pl-3 pb-3 pr-3 pt-10 sm:p-6">
            <h2 className="text-3xl font-black mb-8 px-4">You’ve Earned a Free Question Deck!</h2>
            <CelebrationIcons />
            <h4 className="my-8 text-xl font-semibold">You have {numTotal} free credits in your account</h4>
            <div className="w-11/12 sm:w-3/4 self-center">
                <Button onClick={clickHandler} type="button">Browse Question Decks</Button>
            </div>
        </div>
    )
}

export default CreditAward