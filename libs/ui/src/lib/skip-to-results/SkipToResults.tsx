import tw from 'tailwind-styled-components';
import ModalContent from '../containers/ModalContent';
import Button from '../button/Button';

const List = tw.ul`
    bg-light-gray
    rounded-3xl
    sm:pl-6
    sm:pr-3
    py-4
    w-11/12
    mx-auto
    space-y-4
`

const MainHeader = tw.h1`
    text-title-1
    font-black
    text-center
`

const SubHeader = tw.h3`
    text-xl
    text-center
    font-semibold
`

interface SkipToResultsProps {
    confirm: () => void;
    cancel: () => void;
    numHaveNotAnswered: number;
}

/**
 * A confirmation dialog giving a game host the choice between skipping to game/question results,
 * or canceling and returning to the waiting room.
 *
 * The children should be a list of players, each of which
 * can be removed from the game individually.
 *
 * This component assumes that there are always child elements, and should not be shown if there
 * are none.
 *
 * @param confirm handler move the question to the question results
 * @param cancel handler close the modal
 * @param numHaveNotAnswered number of players that haven't answered
 * @param children should be a list of SkipPlayerRow elements
 * @returns
 */
const SkipToResults: React.FC<SkipToResultsProps> = ({ confirm, cancel, numHaveNotAnswered, children }) => {

    return (
        <ModalContent>
            <MainHeader>
                {numHaveNotAnswered} {numHaveNotAnswered === 1 ? "Player Hasn't" : "Players Haven't"} Answered
            </MainHeader>

            <SubHeader>
                You can skip these players <span className="font-black">for this question</span> to keep the game moving.
            </SubHeader>

            {/* Buttons */}
            <div className="w-full sm:w-2/3 gap-4 flex flex-col justify-center">
                <Button type="button" onClick={confirm}>Yes, Skip Them</Button>
                <Button type="button" $secondary onClick={cancel}>Cancel</Button>
            </div>

            {/* Player List */}
            <List>
                {children}
            </List>
        </ModalContent>
    )
}

export default SkipToResults;