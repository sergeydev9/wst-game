import { Button } from '@whosaidtrue/ui';
import { setFullModal } from '../..';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectIsReader } from '../../question/questionSlice';

const StartGame: React.FC = () => {
    const dispatch = useAppDispatch()
    const isReader = useAppSelector(selectIsReader);

    const skipQuestion = () => {
        dispatch(setFullModal('confirmSkipQuestion'))
    }

    const takeOver = () => {
        dispatch(setFullModal('confirmTakeOverReading'))
    }

    return (
        <>
            <Button $secondary onClick={skipQuestion}>Skip Question</Button>
            {!isReader && <Button $secondary onClick={takeOver}>Take Over Reading the Question</Button>}
        </>)
}

export default StartGame;