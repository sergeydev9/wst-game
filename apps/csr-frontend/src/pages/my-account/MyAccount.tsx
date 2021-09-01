import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    selectDeckCredits,
    selectEmail,
    fetchDetails,
    updateAccount,
    logout,
    ChangePassword
} from '../../features';
import {
    Form,
    Title1,
    FormGroup,
    TextInput,
    Button,
    Headline,
    ErrorText,
    InputLabel,
    Box,
    Modal
} from "@whosaidtrue/ui";
import { setFullModal, selectFullModalFactory } from '../../features/modal/modalSlice';

const MyAccount: React.FC = () => {
    const history = useHistory()
    const dispatch = useAppDispatch();
    const deckCredits = useAppSelector(selectDeckCredits)
    const email = useAppSelector(selectEmail)
    const changePassOpen = useAppSelector(selectFullModalFactory('changePassword'))

    useEffect(() => {
        dispatch(fetchDetails())
    }, [dispatch])

    const formik = useFormik({
        initialValues: {
            email
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required')
        }),
        onSubmit: (values) => {
            dispatch(updateAccount({ email: values.email }))
        }
    })

    const logOutClick = (e: React.MouseEvent) => {
        dispatch(logout())
        history.push('/');
    }

    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;

    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10 filter drop-shadow-card">
            {/*title*/}
            <Title1 className="text-center mb-8">My Account</Title1>
            <Form onSubmit={formik.handleSubmit}>

                {/* email */}
                <FormGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} $hasError={emailErr} id="email" $border name="email" type="email" />
                    {emailErr ? (<ErrorText>{formik.errors.email}</ErrorText>) : null}
                </FormGroup>

                {/* Change Password */}
                <Headline className="text-left underline text-basic-gray cursor-pointer" onClick={() => dispatch(setFullModal('changePassword'))}>Change Password</Headline>

                {/* Deck Credits */}
                <Headline className="text-basic-black text-left">Free Question Deck Credits: {deckCredits}</Headline>

                {/* Save/Cancel */}
                <div className="flex flex-row gap-10 items-center">
                    <Button buttonStyle='default' type='submit'>Save Changes</Button>
                    <Headline className="underline text-basic-black cursor-pointer" onClick={() => history.go(-1)}>Cancel</Headline>
                </div>
                <h4 className="text-off-blue cursor-pointer border-b-2 border-off-blue w-max mx-auto text-xl tracking-wide font-bold leading-relaxed" onClick={logOutClick}>Log Out</h4>
            </Form>
            <Modal isOpen={changePassOpen} onRequestClose={() => dispatch(setFullModal(''))}>
                <ChangePassword />
            </Modal>
        </Box >

    )
}

export default MyAccount;