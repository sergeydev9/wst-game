import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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
import { selectAuthError, setErrorThunk, clearError } from './authSlice';
import { Link } from 'react-router-dom';
import { setFullModal } from '../modal/modalSlice';
import { clearCart } from '../cart/cartSlice';
import { clear } from '../decks/deckSlice';

export interface AuthFormProps {
    endpoint: string;
    title: string;
    buttonlabel: string;
    $showMinLength?: boolean;
    $showForgotPassword?: boolean;
    $smallTitle?: boolean;
    onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ endpoint, onSuccess, buttonlabel, title, $showMinLength, $showForgotPassword, $smallTitle }) => {
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

            // clear any error messages
            dispatch(clearError())
            return api.post<AuthenticationResponse>(endpoint, { email, password }).then(response => {
                const { token } = response.data
                const decoded = decodeUserToken(token)
                const { user } = decoded;

                // login
                dispatch(login({ ...user, token }))

                // call optional callback
                onSuccess()
            }).catch(e => {
                const { status, data } = e.response
                if ((status === 422 || status === 401) && data) {
                    dispatch(setErrorThunk(e.response.data as string))
                } else {
                    // manually set message to avoid accidentallly printing a cryptic error message on unexpected error.
                    dispatch(setErrorThunk('An unknown error has occurred, please try again later'))
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
        dispatch(clear())
    }
    // render
    return (
        <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
            {/* title */}
            {$smallTitle ? <Title2 className="text-center mb-3">{title}</Title2> : <LargeTitle className="text-center mb-3">{title}</LargeTitle>}

            {/* This error reporting stuff is placeholder*/}
            {authError && <ErrorText className="text-center">{authError}</ErrorText>}


            {/* email */}
            <FormGroup>
                <InputLabel htmlFor="email">Email</InputLabel>
                <TextInput {...formik.getFieldProps('email')} $hasError={emailErr} id="email" $border name="email" type="email" />
                {emailErr && <ErrorText>{formik.errors.email}</ErrorText>}
            </FormGroup>

            {/* password */}
            <FormGroup>
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextInput {...formik.getFieldProps('password')} id="password" $hasError={pwErr} $border name="password" type="password" />
                {$showMinLength && <Headline className="text-basic-gray">8 character minimum length</Headline>}
                {$showForgotPassword && <Headline className="text-basic-gray underline mt-3" onClick={clearCartAndDetails}><Link to="/reset/send-email">Forgot Password?</Link></Headline>}

                {pwErr && <ErrorText>{formik.errors.password}</ErrorText>}
            </FormGroup>

            {/* submit */}
            <Button color="blue" type="submit" >{buttonlabel}</Button>
        </form>
    )
}

export default AuthForm