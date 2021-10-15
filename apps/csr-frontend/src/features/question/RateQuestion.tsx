import { useEffect, useState } from 'react';
import { SubmitRating } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { UserRating } from '@whosaidtrue/app-interfaces';
import { selectId } from '../auth/authSlice';
import { selectQuestionId } from './questionSlice';

const RateQuestion: React.FC = () => {
    const [hasRated, setHasRated] = useState(false);
    const userId = useAppSelector(selectId)
    const questionId = useAppSelector(selectQuestionId)

    useEffect(() => {

        const checkIfUserHasRated = async () => {
            console.log('checking')
        }

        checkIfUserHasRated();
    }, [])

    const submitHandler = (v: UserRating) => {
        console.log(v)
    }

    // if user hasn't rated this question, show submit element, else show nothing
    return !hasRated ? (
        <SubmitRating submitRatingHandler={submitHandler} />
    ) : null
}

export default RateQuestion;