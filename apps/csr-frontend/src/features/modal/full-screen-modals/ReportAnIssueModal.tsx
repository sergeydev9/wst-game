import { useFormik } from "formik";
import * as Yup from 'yup';
import { setFullModal } from "../..";
import { useAppDispatch } from "../../../app/hooks";
import { sendMessage } from "../../send-message/sendMessage";
import { Title1, FormGroup, InputLabel, ErrorText, TextInput, TextArea, Button, ModalContent } from "@whosaidtrue/ui";
import { showError, showSuccess } from "../modalSlice";


const ReportAnIssue: React.FC = () => {
    const dispatch = useAppDispatch();

    // Form
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required(),
            name: Yup.string().required(),
            message: Yup.string().required()
        }),
        onSubmit: (values) => {
            dispatch(sendMessage({ ...values, category: 'Report an Issue' })).then(() => {
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
            <form className="m-3 sm:m-7 w-full px-6 sm:px-16" onSubmit={formik.handleSubmit}>

                <Title1 className="text-center mb-3">Report an Issue</Title1>

                {/* name */}
                <FormGroup className="mt-4">
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput {...formik.getFieldProps('name')} id="name" $hasError={nameErr} $border name="name" type="text" />

                    {nameErr && <ErrorText>{formik.errors.name}</ErrorText>}
                </FormGroup>

                {/* email */}
                <FormGroup className="mt-4">
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} $hasError={emailErr} id="email" $border name="email" type="email" />
                    {emailErr && <ErrorText>{formik.errors.email}</ErrorText>}
                </FormGroup>


                {/* message */}
                <FormGroup className="mt-4">
                    <InputLabel htmlFor="message">Please tell us what went wrong</InputLabel>
                    <TextArea {...formik.getFieldProps('message')} $hasError={emailErr} id="message" name="message" />
                    {messageErr && <ErrorText>{formik.errors.message}</ErrorText>}
                </FormGroup>

                {/* submit */}
                <Button color="blue" type="submit" className="mt-4" >Send</Button>
            </form>
        </ModalContent>
    )
}

export default ReportAnIssue;