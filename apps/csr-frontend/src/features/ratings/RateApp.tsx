import { Box } from '@whosaidtrue/ui';
import tw from 'tailwind-styled-components';
import { FaRegThumbsDown } from '@react-icons/all-files/fa/FaRegThumbsDown'
import { FaRegThumbsUp } from '@react-icons/all-files/fa/FaRegThumbsUp';
import { useAppDispatch } from '../../app/hooks';
import { UserRating } from '@whosaidtrue/app-interfaces';
import { setHasRatedApp } from './ratingsSlice';
import { showSuccess, showError } from '../modal/modalSlice';
import { api } from '../../api';


const Container = tw.div`
filter
shadow-md
bg-white
cursor-pointer
border
rounded-full
text-4xl
w-16
h-16
flex
p-2
justify-center
items-center
`

const RateApp: React.FC = () => {
    const dispatch = useAppDispatch();

    const submitHandler = (rating: UserRating) => {
        api.post(`ratings/app`, { rating }).then(_ => {
            dispatch(showSuccess('Thanks for the feedback!'))
            dispatch(setHasRatedApp(true))
        }).catch(err => {
            dispatch(showError('Oops, something went wrong...'))
            console.error(err)
        })
    }

    // if user hasn't rated this question, show submit element, else show nothing
    return (
        <Box boxstyle="purple-subtle" className="w-max text-center p-6 my-8 mx-auto">
            <h4 className="font-black text-basic-black text-2xl mb-4">Rate Who Said True?!</h4>
            <div className="flex flex-row gap-4">
                <Container className="border-green-base hover:bg-green-subtle-stroke" onClick={() => submitHandler('great')}>
                    <FaRegThumbsUp className="text-green-base" />
                </Container>
                <Container className="border-1 border-red-base hover:bg-red-subtle-stroke" onClick={() => submitHandler('bad')}>
                    <FaRegThumbsDown className="text-red-base" />
                </Container>
            </div>
        </Box>
    )

}

export default RateApp;