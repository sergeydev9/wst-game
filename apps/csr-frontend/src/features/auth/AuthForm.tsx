import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { AuthenticationResponse } from '@whosaidtrue/api-interfaces';
import { decodeUserToken } from '../../util/functions';
import { login } from '../../features'
import {
    Form,
    LargeTitle,
    FormGroup,
    TextInput,
    InputLabel,
    Button,
    Headline,
    ErrorText
} from "@whosaidtrue/ui";
import { api } from '../../api';
import { selectAuthError, setErrorThunk, clearError } from './authSlice';

export interface AuthFormProps {
    endpoint: string;
    title: string;
    buttonlabel: string;
    $showMinLength?: boolean;
    onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ endpoint, onSuccess, buttonlabel, $showMinLength, title }) => {
    const dispatch = useAppDispatch();

    // TODO: need to clarify how this error is reported. Maybe move this to flash message modal?
    const authError = useAppSelector(selectAuthError)

    // Form
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters long')
                .matches(/\d/, 'Password must contain at least 1 number')
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            const { email, password } = values
            try {
                dispatch(clearError())
                const response = await api.post<AuthenticationResponse>(endpoint, { email, password })
                const { token } = response.data
                const decoded = decodeUserToken(token)
                const { user } = decoded;
                dispatch(login({ ...user, token }))
                onSuccess()
            } catch (e) {
                if (e.response?.status === 422 && e.response?.data) {
                    dispatch(setErrorThunk(e.response.data as string))
                } else {
                    // manually set message to avoid accidentallly printing a cryptic error message on unexpected error.
                    dispatch(setErrorThunk('An unknown error has occurred, please try again later'))
                    console.error(e)
                }
            }
        },
    });
    const emailErr = formik.touched.email && formik.errors.email ? true : false;
    const pwErr = formik.touched.password && formik.errors.password ? true : false;
    // render
    return (
        <Form onSubmit={formik.handleSubmit}>
            {/* title */}
            <FormGroup>
                <LargeTitle className="text-center mb-8">{title}</LargeTitle>

                {/* This error reporting stuff is placeholder*/}
                {authError ? <ErrorText>An account already exists with that email.</ErrorText> : null}
            </FormGroup>

            {/* email */}
            <FormGroup>
                <InputLabel htmlFor="email">Email</InputLabel>
                <TextInput {...formik.getFieldProps('email')} error={emailErr} id="email" $border name="email" type="email" />
                {emailErr ? (<ErrorText>{formik.errors.email}</ErrorText>) : null}
            </FormGroup>

            {/* password */}
            <FormGroup>
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextInput {...formik.getFieldProps('password')} id="password" error={pwErr} $border name="password" type="password" />
                {$showMinLength && <Headline className="text-basic-gray my-3">8 character minimum length</Headline>}
                {pwErr ? (<ErrorText>{formik.errors.password}</ErrorText>) : null}
            </FormGroup>

            {/* submit */}
            <Button color="blue" type="submit" className="w-full">{buttonlabel}</Button>
        </Form>
    )
}

export default AuthForm