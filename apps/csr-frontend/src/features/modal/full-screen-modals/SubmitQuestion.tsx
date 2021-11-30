import { useFormik } from "formik";
import * as Yup from 'yup';
import { Title1, FormGroup, InputLabel, ErrorText, TextInput, TextArea, Button, ModalContent } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { setFullModal, showError, showSuccess } from "../../modal/modalSlice";
import { sendMessage } from "../../send-message/sendMessage";
import { selectEmail } from '../../auth/authSlice';



const SubmitQuestion: React.FC = () => {
    const dispatch = useAppDispatch();
    const email = useAppSelector(selectEmail);

    // Form
    const formik = useFormik({
        initialValues: {
            name: '',
            email: email || '', // default to user's email if there is one
            message: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            name: Yup.string().required(),
            message: Yup.string().required()
        }),
        onSubmit: async (values) => {
            dispatch(sendMessage({ ...values, category: 'Submit a Question' })).then(() => {
                dispatch(showSuccess('Thank you for your feedback'))
                dispatch(setFullModal(''))
            }).catch(() => {
                dispatch(showError('An unexpected error occured while sending your message'))
            })
        },
    });
    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;
    const nameErr = formik.touched.name && formik.errors.name ? true : undefined;
    const messageErr = formik.touched.name && formik.errors.name ? true : undefined;

    // render
    return (
        <ModalContent $narrow>
            <form className="m-7 w-full px-16" onSubmit={formik.handleSubmit}>

                <Title1 className="text-center mb-3">Submit a Question</Title1>

                {/* name */}
                <FormGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput {...formik.getFieldProps('name')} id="name" $hasError={nameErr} $border name="name" type="text" />

                    {nameErr && <ErrorText>{formik.errors.name}</ErrorText>}
                </FormGroup>

                {/* email */}
                <FormGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} $hasError={emailErr} id="email" $border name="email" type="email" />
                    {emailErr && <ErrorText>{formik.errors.email}</ErrorText>}
                </FormGroup>


                {/* message */}
                <FormGroup>
                    <InputLabel htmlFor="message">What do you have in mind?</InputLabel>
                    <TextArea {...formik.getFieldProps('message')} $hasError={emailErr} id="message" name="message" />
                    {messageErr && <ErrorText>{formik.errors.message}</ErrorText>}
                </FormGroup>

                {/* submit */}
                <Button color="blue" type="submit" >Send</Button>
            </form>
        </ModalContent>
    )
}

export default SubmitQuestion;