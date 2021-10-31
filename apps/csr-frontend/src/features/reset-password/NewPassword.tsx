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
            newPass: '',
            confPass: ''
        },
        validationSchema: Yup.object({
            newPass: Yup.string()
                .min(8, 'Password must be at least 8 characters long')
                .matches(/\d/, 'Password must contain at least 1 number')
                .required('Password is required'),
            confPass: Yup.string().oneOf([Yup.ref('newPass'), null], 'Passwords do not match').required('Must confirm new password')

        }),
        onSubmit: async (values) => {
            const { newPass } = values
            try {
                const response = await api.post<AuthenticationResponse>('/user/reset-password', { newPass })
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
    const newPassErr = formik.touched.newPass && formik.errors.newPass ? true : undefined;
    const confErr = formik.touched.confPass && formik.errors.confPass ? true : undefined;
    // render
    return (
        <NoFlexBox className="w-max mx-auto">
            <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
                {/* title */}
                <FormGroup>
                    <LargeTitle className="text-center mb-3">Enter New Password</LargeTitle>
                    {err && <ErrorText className="text-center">{err}</ErrorText>}
                </FormGroup>

                {/* newPass */}
                <FormGroup>
                    <InputLabel htmlFor="newPass">New Password</InputLabel>
                    <TextInput {...formik.getFieldProps('newPass')} id="newPass" $hasError={newPassErr} $border name="newPass" type="password" />
                    <Headline className="text-basic-gray mt-2">8 character minimum length</Headline>
                    {newPassErr && <ErrorText>{formik.errors.newPass}</ErrorText>}
                </FormGroup>


                {/* confPass */}
                <FormGroup>
                    <InputLabel htmlFor="confPass">Confirm New Password</InputLabel>
                    <TextInput {...formik.getFieldProps('confPass')} id="confPass" $hasError={confErr} $border name="confPass" type="password" />
                    {confErr && <ErrorText>{formik.errors.confPass}</ErrorText>}
                </FormGroup>

                {/* submit */}
                <Button color="blue" type="submit" >Save</Button>
            </form>
        </NoFlexBox>
    )
}

export default NewPassword