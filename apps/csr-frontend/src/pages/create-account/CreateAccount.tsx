import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import {
    Form,
    LargeTitle,
    FormGroup,
    TextInput,
    InputLabel,
    WrappedButton,
    Box,
    Headline
} from "@whosaidtrue/ui";
import { api } from '../../api';

// TODO: finish
const CreateAccount: React.FC = () => {
    const history = useHistory();

    // TODO: need to clarify how this error is reported
    const [inUseError, setInUseError] = useState(false);
    const [unexpectedError, setUnexpectedError] = useState(false);


    // Form
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters long').matches(/\d/, 'Password must contain at least 1 number').required('Password is required')
        }),
        onSubmit: async (values) => {
            const { email, password } = values
            try {
                const result = await api.post('/user/register', { email, password })
                // TODO: add token to auth state
                history.push('/')
            } catch (e) {
                if (e.response && e.response.data === "A user already exists with that email") {
                    setInUseError(true)
                } else {
                    setUnexpectedError(true);
                }
            }
        },
    });


    // render
    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10">
            <Form onSubmit={formik.handleSubmit}>
                {/* title */}
                <FormGroup>
                    <LargeTitle className="text-center mb-8">Create Account</LargeTitle>

                    {/* This error reporting stuff is placeholder*/}
                    {inUseError ? <Headline className="text-red-light">An account already exists with that email.</Headline> : null}
                    {unexpectedError ? <Headline className="text-red-light">An unexpected error occured, please try again later</Headline> : null}
                </FormGroup>

                {/* email */}
                <FormGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} id="email" $border name="email" type="email" />
                    {formik.touched.email && formik.errors.email ? (<div>{formik.errors.email}</div>) : null}
                </FormGroup>

                {/* password */}
                <FormGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <TextInput {...formik.getFieldProps('password')} id="password" $border name="password" type="password" />
                    <Headline className="text-basic-gray my-3">8 character minimum length</Headline>
                    {formik.touched.password && formik.errors.password ? (<div>{formik.errors.password}</div>) : null}
                </FormGroup>

                {/* submit */}
                <WrappedButton color="blue" type="submit" fontSize="label-big" className="w-full">Create Account</WrappedButton>
            </Form>
            <div className="text-center text-basic-black mt-8">
                <Headline>Already have an account?</Headline>
                <Link to="/login"><Headline className="underline">Log in</Headline></Link>
            </div>
        </Box>

    )
}

export default CreateAccount;