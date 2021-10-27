import { useFormik } from 'formik';
import * as Yup from 'yup';
import { passwordValidationObject } from '@whosaidtrue/util';
import { api } from '../../../api';
import {
    TextInput,
    FormGroup,
    Button,
    InputLabel,
    ErrorText,
    Headline,
    Title2,
    ModalContent
} from '@whosaidtrue/ui';
import { useAppDispatch } from '../../../app/hooks';
import { setFullModal, showError, showSuccess } from '../modalSlice';
import { Link } from 'react-router-dom';

const ChangePassword: React.FC = () => {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            oldPass: '',
            newPass: '',
            confPass: ''
        },
        validationSchema: Yup.object({
            oldPass: passwordValidationObject.required('You must enter your old password'),
            newPass: passwordValidationObject,
            confPass: Yup.string().oneOf([Yup.ref('newPass'), null], 'Passwords do not match').required('Must confirm new password')
        }),
        onSubmit: async (values) => {
            const { oldPass, newPass } = values

            return api.patch('/user/change-password', { oldPass, newPass }).then(() => {
                dispatch(showSuccess('Password successfully changed!'))
                dispatch(setFullModal(''))

            }).catch(e => {

                if (e.response && e.response.status === 401) {
                    dispatch(showError('Old password incorrect'))
                } else {
                    dispatch(showError('An unexpected error occurred while changing password. Please try again later.'))
                }

            })
        }
    })

    // errors will be strings if they exist. Only booleans are needed
    const oldPwErr = formik.touched.oldPass && formik.errors.oldPass ? true : undefined
    const newPwErr = formik.touched.newPass && formik.errors.newPass ? true : undefined
    const confPwErr = formik.touched.confPass && formik.errors.confPass ? true : undefined

    return (
        <ModalContent>
            <form className="w-full flex flex-col gap-4" onSubmit={formik.handleSubmit}>

                {/* title */}
                <FormGroup>
                    <Title2 className="text-center">Change Password</Title2>
                </FormGroup>

                {/* oldPass */}
                <FormGroup>
                    <InputLabel htmlFor="oldPass">Old Password</InputLabel>
                    <TextInput className="block" {...formik.getFieldProps('oldPass')} id="oldPass" $hasError={oldPwErr} $border name="oldPass" type="password" />
                    {oldPwErr && <ErrorText>{formik.errors.oldPass}</ErrorText>}
                </FormGroup>

                {/* newPass */}
                <FormGroup>
                    <InputLabel htmlFor="newPass">New Password</InputLabel>
                    <TextInput className="block" {...formik.getFieldProps('newPass')} id="newPass" $hasError={newPwErr} $border name="newPass" type="password" />
                    {newPwErr && <ErrorText>{formik.errors.newPass}</ErrorText>}
                </FormGroup>

                {/* confPass */}
                <FormGroup>
                    <InputLabel htmlFor="confPass">Confirm New Password</InputLabel>
                    <TextInput className="block" {...formik.getFieldProps('confPass')} id="confPass" $hasError={confPwErr} $border name="confPass" type="password" />
                    {confPwErr && <ErrorText>{formik.errors.confPass}</ErrorText>}
                </FormGroup>
                <div className="px-32 mt-4">
                    <Button type="submit" >Change Password</Button>
                </div>
            </form>

            {/* forgot password link */}
            <Headline
                onClick={() => dispatch(setFullModal(''))}
                className="text-basic-gray underline cursor-pointer mt-10">
                <Link to="/reset/send-email">Forgot Password?</Link>
            </Headline>
        </ModalContent>
    )
}
export default ChangePassword;