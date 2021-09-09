import { useFormik } from "formik";
import * as Yup from 'yup';
import { setFullModal } from "..";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Title1, FormGroup, InputLabel, ErrorText, TextInput, TextArea, Button } from "@whosaidtrue/ui";


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
            email: Yup.string().email('Invalid email address').required('Email is required'),
            name: Yup.string().required(),
            message: Yup.string().required()
        }),
        onSubmit: async (values) => {
            // TODO: figure out where/how these messages will be sent
            const { email, name, message } = values
            dispatch(setFullModal(''))
        },
    });
    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;
    const nameErr = formik.touched.name && formik.errors.name ? true : undefined;
    const messageErr = formik.touched.name && formik.errors.name ? true : undefined;


    // render
    return (
        <form className="m-7 w-full px-16" onSubmit={formik.handleSubmit}>

            <Title1 className="text-center mb-3">Report an Issue</Title1>

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
                <InputLabel htmlFor="message">Please tell us what went wrong</InputLabel>
                <TextArea {...formik.getFieldProps('message')} $hasError={emailErr} id="message" name="message" />
                {messageErr && <ErrorText>{formik.errors.message}</ErrorText>}
            </FormGroup>

            {/* submit */}
            <Button color="blue" type="submit" >Send</Button>
        </form>
    )
}

export default ReportAnIssue;