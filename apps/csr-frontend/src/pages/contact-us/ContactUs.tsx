import { useFormik } from "formik";
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import {
    Form,
    LargeTitle,
    FormGroup,
    TextInput,
    TextArea,
    Button,
    SelectDropdown,
    InputLabel,
    Box,
    ErrorText
} from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectEmail, sendMessage, showError } from "../../features";

/**
 * Contact form. If message is successfully sent, push user
 * to a thank you page.
 */
const ContactUs: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const userEmail = useAppSelector(selectEmail);

    const formik = useFormik({
        initialValues: {
            email: userEmail ?? '', // should already be empty string if empty, but just in case.
            name: '',
            message: '',
            category: 'Suggest A Question'
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required(),
            name: Yup.string()
                .required()
                .max(200, 'Name is too long'),
            category: Yup.string()
                .required(),
            message: Yup.string()
                .required()
                .max(20000, "That message is too long")

        }),
        onSubmit: (values) => {
            dispatch(sendMessage(values)).then(() => {
                history.push('/thanks')
            }).catch(e => {
                console.error(e);
                dispatch(showError('Oops, something went wrong'));
            })
        }
    })

    const nameErr = formik.touched.name && formik.errors.name !== undefined;
    const emailErr = formik.touched.email && formik.errors.email !== undefined;
    const messageErr = formik.touched.message && formik.errors.message !== undefined;

    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10 filter drop-shadow-card">
            <Form onSubmit={formik.handleSubmit}>
                {/* title */}
                <FormGroup>
                    <LargeTitle className="text-center mb-8">Contact Us</LargeTitle>
                </FormGroup>

                {/* name */}
                <div className='w-11/12 flex-shrink-1 text-left'>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput data-cy="contact-name" $border {...formik.getFieldProps('name')} name="name" type="text" />
                    {nameErr && <ErrorText data-cy="name-error">{formik.errors.name}</ErrorText>}
                </div>

                {/* email */}
                <FormGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput data-cy="contact-email" $border {...formik.getFieldProps('email')} name="email" type="email" />
                    {emailErr && <ErrorText data-cy="email-error">{formik.errors.email}</ErrorText>}
                </FormGroup>

                {/* category */}
                <FormGroup>
                    <InputLabel htmlFor="category">Category</InputLabel>
                    <SelectDropdown data-cy="category-dropdown" {...formik.getFieldProps('category')} name="category">
                        <option value="Suggest a Question">Suggest a Question</option>
                        <option value="Bug">Bug</option>
                        <option value="Feedback">Give Feedback</option>
                        <option value="Player Story">Submit a Player Story</option>
                        <option value="Report a Problem">Report a Problem</option>
                    </SelectDropdown>
                </FormGroup>

                {/* message */}
                <FormGroup>
                    <InputLabel htmlFor="message">Comments, Questions, and / or Concerns</InputLabel>
                    <TextArea data-cy="contact-message" {...formik.getFieldProps('message')} name="message" />
                    {messageErr && <ErrorText data-cy="message-error">{formik.errors.message}</ErrorText>}
                </FormGroup>

                {/* submit */}
                <Button data-cy="contact-submit" type="submit" >Send</Button>
            </Form>
        </Box>

    )
}

export default ContactUs;