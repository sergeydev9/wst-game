import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../app/hooks';
import {
    FormGroup,
    TextInput,
    InputLabel,
    Button,
    ErrorText,
    Title1,
    NoFlexBox
} from "@whosaidtrue/ui";
import { api } from '../../api';
import { setFullModal, showError } from '../modal/modalSlice';

const RequestFreeCredit: React.FC = () => {
    const dispatch = useAppDispatch();

    // Form
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values) => {
            const { email } = values

            return api.post('/user/free-credit-signup', { email }).then(response => {
                // on success, show "check your email modal"
                dispatch(setFullModal('checkYourEmail'))
            }).catch(e => {
                if (e.response.data === 'email already in use') {
                    dispatch(setFullModal('freeCreditEmailInUseError'))
                } else {
                    dispatch(showError('Oops, something went '))
                    console.error(e)
                }
            })
        },
    });
    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;

    // render
    return (
        <NoFlexBox className="w-96 mx-auto">
            <form className="text-center" onSubmit={formik.handleSubmit}>
                {/* title */}
                <Title1 className="text-center mb-3">Want a FREE Question Deck?!</Title1>
                <p className="font-semibold my-4">Enter your email and we’ll send you a link to claim your FREE Question Deck!!</p>

                {/* email input  */}
                <FormGroup>
                    <InputLabel data-cy="email-input" htmlFor="email">Email</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} className="block" $hasError={emailErr} id="email" $border name="email" type="email" />
                    {emailErr && <ErrorText>{formik.errors.email}</ErrorText>}
                </FormGroup>

                <div className="mb-3 h-2"></div>
                {/* submit */}
                <Button color="blue" data-cy="login-submit" type="submit">Send Me the Link!</Button>
            </form>
        </NoFlexBox>

    )
}

export default RequestFreeCredit