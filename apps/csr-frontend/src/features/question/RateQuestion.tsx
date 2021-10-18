import { SubmitRating } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { UserRating } from '@whosaidtrue/app-interfaces';
import { selectQuestionId, setHasRated } from './questionSlice';
import { showSuccess, showError } from '../modal/modalSlice';
import { api } from '../../api';

const RateQuestion: React.FC = () => {
    const dispatch = useAppDispatch();
    const questionId = useAppSelector(selectQuestionId)

    const submitHandler = (rating: UserRating) => {
        api.post(`ratings/question`, { questionId, rating }).then(response => {
            dispatch(showSuccess('Thanks for the feedback!'))
            dispatch(setHasRated(true))
        }).catch(err => {
            dispatch(showError('Oops, something went wrong...'))
            console.error(err)
        })
    }

    // if user hasn't rated this question, show submit element, else show nothing
    return <SubmitRating submitRatingHandler={submitHandler} />

}

export default RateQuestion;