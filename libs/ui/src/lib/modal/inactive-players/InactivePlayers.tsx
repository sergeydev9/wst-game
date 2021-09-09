import ModalContent from '../../containers/ModalContent';
import Button from '../../button/Button';
import { Title1 } from '../../typography/Typography';

export interface InactivePlayersProps {
    numNoAnswer: number;
    confirmHandler: () => void;
    cancelHandler: () => void;
}
const InactivePlayers: React.FC<InactivePlayersProps> = ({ children, confirmHandler, cancelHandler, numNoAnswer }) => {
    return (
        <ModalContent className="select-none">
            <Title1 className="text-center select-none">{numNoAnswer === 1 ? "1 Player hasn't answered" : `${numNoAnswer} players haven't answered`}</Title1>
            <h2 className="text-xl text-center select-none">You can skip these players to keep the game moving.</h2>
            <div className="flex flex-col gap-3 sm:w-2/3 md:w-1/2">
                <Button onClick={confirmHandler} type="button">Yes, Skip Them</Button>
                <Button $secondary onClick={cancelHandler} type="button">Cancel</Button>
            </div>
            <ul className="bg-light-gray rounded-2xl pb-4 pt-2 pl-4 pr-2 md:pl-8 w-11/12 leading-relaxed">{children}</ul>
        </ModalContent>
    )
}

export default InactivePlayers