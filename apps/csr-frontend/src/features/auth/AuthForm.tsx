import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../app/hooks';
import { AuthenticationResponse } from '@whosaidtrue/api-interfaces';
import { decodeUserToken } from '../../util/functions';
import { login } from './authSlice'
import {
    LargeTitle,
    FormGroup,
    TextInput,
    InputLabel,
    Button,
    Headline,
    ErrorText,
    Title2
} from "@whosaidtrue/ui";
import { api } from '../../api';
import { clearError } from './authSlice';
import { Link } from 'react-router-dom';
import { setFullModal, showError } from '../modal/modalSlice';
import { clearCart } from '../cart/cartSlice';
import EmailInUse from './EmailInUse';

export interface AuthFormProps {
    endpoint: string;
    title: string;
    buttonlabel: string;
    $showMinLength?: boolean;
    $showForgotPassword?: boolean;
    $smallTitle?: boolean;
    onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
    endpoint,
    onSuccess,
    buttonlabel,
    title,
    $showMinLength,
    $showForgotPassword,
    $smallTitle
}) => {
    const dispatch = useAppDispatch();
    const [showGuestMessage, setShowGuestMessage] = useState(false);

    // Form
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/\d/, 'Password must contain at least 1 number')
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            const { email, password } = values

            // clear any error messages
            dispatch(clearError())
            return api.post<AuthenticationResponse>(endpoint, { email, password }).then(response => {
                const { token } = response.data
                const decoded = decodeUserToken(token)
                const { user } = decoded;

                // login
                dispatch(login({ ...user, token }))
            }).then(() => {
                onSuccess();
            }).catch(e => {
                const { status, data } = e.response

                if (data && status === 422) {
                    if (data === "A user already exists with that email") {
                        setShowGuestMessage(true); // only happens during registration if account is alreaedy taken
                    }
                } else if (status === 401) {
                    dispatch(showError("Incorrect email/password"))
                } else {
                    // show error message
                    dispatch(showError('An unknown error has occurred, please try again later'))
                    console.error(e)
                }
            })
        },
    });
    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;
    const pwErr = formik.touched.password && formik.errors.password ? true : undefined;

    const clearCartAndDetails = () => {
        dispatch(setFullModal(''))
        dispatch(clearCart())
    }

    const linkClass = "text-basic-gray underline cursor-pointer mt-4";

    // render
    return (
        <form className="w-full px-2 md:mt-2" onSubmit={formik.handleSubmit}>
            {/* title */}
            {$smallTitle ? <Title2 className="text-center mb-3">{title}</Title2> : <LargeTitle className="text-center mb-3">{title}</LargeTitle>}

            {/* message when email in use */}
            {showGuestMessage && <EmailInUse />}

            {/* email */}
            <FormGroup>
                <InputLabel data-cy="email-input" htmlFor="email">Email</InputLabel>
                <TextInput {...formik.getFieldProps('email')} className="block" $hasError={emailErr} id="email" $border name="email" type="email" />
                {emailErr && <ErrorText>{formik.errors.email}</ErrorText>}
            </FormGroup>

            {/* password */}
            <FormGroup className="mb-3">
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextInput data-cy="password-input" {...formik.getFieldProps('password')} id="password" $hasError={pwErr} $border name="password" type="password" />
                {$showMinLength && <Headline className="text-basic-gray">8 character minimum length</Headline>}
                {$showForgotPassword && <Headline className="mt-2" ><Link className={linkClass} data-cy="reset-link" onClick={clearCartAndDetails} to="/reset/send-email">Forgot Password?</Link></Headline>}
                {pwErr && <ErrorText>{formik.errors.password}</ErrorText>}
            </FormGroup>

            <div className="mb-3 h-2"></div>
            {/* submit */}
            <div className="flex justify-center">
                <Button color="blue" data-cy="login-submit" type="submit">{buttonlabel}</Button>
            </div>
        </form>
    )
}

export default AuthForm