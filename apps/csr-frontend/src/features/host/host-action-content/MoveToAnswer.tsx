import { Button } from '@whosaidtrue/ui'
import { setFullModal } from '../../modal/modalSlice';
import { useAppDispatch } from '../../../app/hooks';

const MoveToAnswer: React.FC = () => {
    const dispatch = useAppDispatch();

    const handler = () => {
        dispatch(setFullModal('skipToResults'))
    }

    return <Button onClick={handler}>Skip to Results</Button>
}

export default MoveToAnswer;