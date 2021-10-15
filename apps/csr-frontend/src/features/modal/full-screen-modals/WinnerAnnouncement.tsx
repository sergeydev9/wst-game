import { WinnerAnnouncement as Ui } from '@whosaidtrue/ui';
import { selectWinner } from '../../question/questionSlice';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setFullModal } from '../modalSlice';

const WinnerAnnouncement: React.FC = () => {
    const dispatch = useAppDispatch();
    const winner = useAppSelector(selectWinner);

    const close = () => {
        dispatch(setFullModal(''));
    }
    return <Ui name={winner} onRequestClose={close} />
}
export default WinnerAnnouncement;