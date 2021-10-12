import { Button } from '@whosaidtrue/ui';
import { setFullModal } from '../..';
import { useAppDispatch } from '../../../app/hooks';

const StartGame: React.FC = () => {
    const dispatch = useAppDispatch()

    const skipQuestion = () => {
        dispatch(setFullModal('confirmSkipQuestion'))
    }

    const takeOver = () => {
        dispatch(setFullModal('confirmTakeOverReading'))
    }

    return (
        <>
            <Button $secondary onClick={skipQuestion}>Skip Question</Button>
            <Button $secondary onClick={takeOver}>Take Over Reading the Question</Button>
        </>)
}

export default StartGame;