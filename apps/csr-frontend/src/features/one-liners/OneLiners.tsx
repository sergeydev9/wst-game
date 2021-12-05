import { useEffect } from 'react';
import { OneLiners as OLUi } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectOneLinersStatus, selectUpcomingLines } from './oneLinersSlice';
import Spinner from '../loading/Spinner';
import { selectSequenceIndex } from '../question/questionSlice';
import { arrayItemAtIndexCircular } from '../../util/functions';

const OneLiners: React.FC = () => {
  const dispatch = useAppDispatch();
  const upcomingLines = useAppSelector(selectUpcomingLines);
  const questionIndex = useAppSelector(selectSequenceIndex);

  useEffect(() => {
    // return () => {
    //   dispatch(nextLine());
    // };
  }, [dispatch]);

  return upcomingLines.length > 0 ? (
    <OLUi>
      {arrayItemAtIndexCircular<string>(upcomingLines, questionIndex)}
    </OLUi>
  ) : (
    <div className="my-12 w-32 h-32 mx-auto">
      <Spinner />
    </div>
  );
};

export default OneLiners;
