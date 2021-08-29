import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from "../../app/hooks";
import { api } from '../../api';
import { Box, FormGroup, Button, Title1, BodySmall, InputLabel, Form, TextInput, ErrorText } from "@whosaidtrue/ui";

const SendResetForm: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const [error, setError] = useState('')

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email is invalid').required('Email is required')
        }),
        onSubmit: async (values) => {
            try {
                await api.post('/user/send-reset', { email: values.email })
            } catch (e) {
                console.error(e)
            }
        }
    })

    return (
        <Form className="bg-white-ish rounded-3xl mx-auto filter  drop-shadow-card px-8 py-6" onSubmit={formik.handleSubmit}>
            <div>
                <Title1>Reset Password</Title1>
                <BodySmall>Please enter your email</BodySmall>
                {error && <ErrorText>{error}</ErrorText>}
            </div>

            <FormGroup>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <TextInput $border $hasError={error ? true : false} type="email" id="email" {...formik.getFieldProps('email')} />
            </FormGroup>
            <Button type="submit">Send Reset Email</Button>
        </Form>
    )
}

export default SendResetForm