import { useEffect } from 'react';
import { OneLiners as OLUi } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectOneLinersStatus,
    selectCurrentLine,
    selectIsUpcomingEmpty,
    fetchLines,
    nextLine
} from './oneLinersSlice';
import Spinner from '../loading/Spinner';

const OneLiners: React.FC = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectOneLinersStatus);
    const currentLine = useAppSelector(selectCurrentLine);
    const upcomingEmpty = useAppSelector(selectIsUpcomingEmpty);

    useEffect(() => {
        if (upcomingEmpty) {
            dispatch(fetchLines())
        } else {
            dispatch(nextLine)
        }

    }, [dispatch, upcomingEmpty, currentLine])


    return (
        status !== 'error' && currentLine ? <OLUi>
            {currentLine}
        </OLUi> : <div className="my-12 w-32 h-32 mx-auto"><Spinner /></div>
    )
}

export default OneLiners;