import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { AuthenticationResponse } from '@whosaidtrue/api-interfaces';
import { login } from '../auth/authSlice'
import { decodeUserToken } from '../../util/functions';
import { selectResetEmail, selectResetToken } from './resetPasswordSlice';
import {
    LargeTitle,
    FormGroup,
    TextInput,
    InputLabel,
    Button,
    Headline,
    ErrorText,
    NoFlexBox
} from "@whosaidtrue/ui";
import { api } from '../../api';
import { clearReset } from './resetPasswordSlice';
import { useHistory } from 'react-router-dom';


const NewPassword: React.FC = () => {
    const [err, setErr] = useState('')
    const resetToken = useAppSelector(selectResetToken)
    const email = useAppSelector(selectResetEmail)
    const history = useHistory();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // make sure this page is only accessed from previous page
        // after successful code entry
        if (!resetToken || !email) {
            history.push('/')
        }
    })

    // Form
    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(8, 'Password must be at least 8 characters long')
                .matches(/\d/, 'Password must contain at least 1 number')
                .required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords do not match').required('Must confirm new password')

        }),
        onSubmit: async (values) => {
            const { newPassword, confirmPassword } = values
            try {
                const response = await api.patch<AuthenticationResponse>('/user/reset-password', { newPassword, confirmPassword, resetToken })
                const { token } = response.data
                const decoded = decodeUserToken(token)
                const { user } = decoded;

                // login
                dispatch(login({ ...user, token }))
                dispatch(clearReset())

                history.push('/')
            } catch (e) {
                console.error(e);
                setErr('An unexpected error occurred while attempting to set password.')
            }
        },
    });
    const newPasswordErr = formik.touched.newPassword && formik.errors.newPassword ? true : undefined;
    const confErr = formik.touched.confirmPassword && formik.errors.confirmPassword ? true : undefined;
    // render
    return (
        <NoFlexBox className="w-max mx-auto">
            <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
                {/* title */}
                <FormGroup>
                    <LargeTitle className="text-center mb-3">Enter New Password</LargeTitle>
                    {err && <ErrorText className="text-center">{err}</ErrorText>}
                </FormGroup>

                {/* newPassword */}
                <FormGroup>
                    <InputLabel htmlFor="newPassword">New Password</InputLabel>
                    <TextInput {...formik.getFieldProps('newPassword')} id="newPassword" $hasError={newPasswordErr} $border name="newPassword" type="password" />
                    <Headline className="text-basic-gray mt-2">8 character minimum length</Headline>
                    {newPasswordErr && <ErrorText>{formik.errors.newPassword}</ErrorText>}
                </FormGroup>


                {/* confirmPassword */}
                <FormGroup>
                    <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
                    <TextInput {...formik.getFieldProps('confirmPassword')} id="confirmPassword" $hasError={confErr} $border name="confirmPassword" type="password" />
                    {confErr && <ErrorText>{formik.errors.confirmPassword}</ErrorText>}
                </FormGroup>

                {/* submit */}
                <Button color="blue" type="submit" >Save</Button>
            </form>
        </NoFlexBox>
    )
}

export default NewPassword
