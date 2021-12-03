import React, {  useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { Title1} from '@whosaidtrue/ui';
import { useHistory } from 'react-router';
import { ResetCodeVerificationResponse } from '@whosaidtrue/api-interfaces';
import { Formik, useFormikContext, Form, Field, FieldProps } from 'formik';
import { api } from '../../api';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setToken, selectResetEmail, clearReset } from './resetPasswordSlice';
import { showError } from '../modal/modalSlice';
import { InputRow, InputHeader, SendAgainText, FormContainer, InputContainer } from './ResetPassword.styled';
import SecurityCodeDigit from './SecurityCodeDigit';

// get the form, and methods from context. Submit as soon
// as form is valid
const AutoSubmit: React.FC = () => {
    const { values, submitForm, isValid } = useFormikContext<{ char1: string, char2: string, char3: string, char4: string }>();

    useEffect(() => {
        if (values.char1 && values.char2 && values.char3 && values.char4) {
            isValid && submitForm();
        }
    }, [values, submitForm, isValid]);
    return null;
};


/**
 * Reset code input page
 */
const EnterCode: React.FC = () => {
    const email = useAppSelector(selectResetEmail); // user email
    const history = useHistory();
    const dispatch = useAppDispatch();
    const initialValues = {
        char1: '',
        char2: '',
        char3: '',
        char4: ''
    }

    useEffect(() => {
        // make sure this page is only accessed from previous page
        if (!email) {
            history.push('/')
        }
    })

    const sendAgain = () => {
        dispatch(clearReset());
        history.push('/reset/send-email')
    }

    // Input Refs
    const char1Ref = useRef<HTMLInputElement>(null);
    const char2Ref = useRef<HTMLInputElement>(null);
    const char3Ref = useRef<HTMLInputElement>(null);
    const char4Ref = useRef<HTMLInputElement>(null);

    // validation object
    const isDigit = Yup.string().matches(/[0-9]{1}/, 'Inputs must be numbers').required()

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                char1: isDigit,
                char2: isDigit,
                char3: isDigit,
                char4: isDigit,
            })}

            // submit
            onSubmit={async (values, { resetForm }) => {
                const { char1, char2, char3, char4 } = values;
                const code = `${char1}${char2}${char3}${char4}`;

                return api.post<ResetCodeVerificationResponse>('/user/validate-reset', { code, email }).then(response => {
                    const { resetToken } = response.data;
                    dispatch(setToken(resetToken));
                    history.push('/reset/new-pass');

                }).catch(e => {
                    if (e.response && e.response.status === 401) {

                        // if 401, code was wrong. Show message, reset form.
                        dispatch(showError('Incorrect code'));
                        resetForm({ values: initialValues, touched: {}, errors: {} });
                    } else if (e.response && e.response.data === 'reset limit reached') { // if max attempts, clear form, show error, and nav away.
                        dispatch(showError('Maximum attempt limit reached.'));
                        dispatch(clearReset());
                        history.push('/');
                    } else {
                        // show an error message, then nav to home.
                        // This only happens if there is a server side problem
                        dispatch(showError('Oops, an unexpeced error occured. Please try again later'));
                        dispatch(clearReset());
                        history.push('/');
                    }
                })
            }}

        >{(props) => {
            return (
                <FormContainer>
                    <Form>
                        <div className="text-center">
                            <Title1 className="text-basic-black">We sent an email to {email}</Title1>
                        </div>
                        <InputContainer>
                            <InputHeader>Enter the 4-digit code you received to continue</InputHeader>

                            {/* Inputs */}
                            <InputRow>
                                <Field name="char1">
                                    {({ field, meta }: FieldProps<string>) => (
                                        <SecurityCodeDigit
                                            {...field}
                                            $hasError={meta.touched && !!meta.error}
                                            forwardRef={char1Ref}
                                            onChange={(e: React.ChangeEvent) => {
                                                char2Ref.current?.focus();
                                                return props.handleChange(e)
                                            }} />
                                    )}
                                </Field>
                                <Field name="char2">
                                    {({ field, meta }: FieldProps<string>) => (
                                        <SecurityCodeDigit
                                            {...field}
                                            $hasError={meta.touched && !!meta.error}
                                            forwardRef={char2Ref}
                                            onChange={(e: React.ChangeEvent) => {
                                                char3Ref.current?.focus();
                                                return props.handleChange(e)
                                            }} />
                                    )}
                                </Field>
                                <Field name="char3">
                                    {({ field, meta }: FieldProps<string>) => (
                                        <SecurityCodeDigit
                                            {...field}
                                            $hasError={meta.touched && !!meta.error}
                                            forwardRef={char3Ref}
                                            onChange={(e: React.ChangeEvent) => {
                                                char4Ref.current?.focus();
                                                return props.handleChange(e)
                                            }} />
                                    )}
                                </Field>
                                <Field name="char4">
                                    {({ field, meta }: FieldProps<string>) => (
                                        <SecurityCodeDigit
                                            {...field}
                                            $hasError={meta.touched && !!meta.error}
                                            forwardRef={char4Ref}
                                            onChange={(e: React.ChangeEvent) => {
                                                char1Ref.current?.focus();
                                                return props.handleChange(e)
                                            }} />
                                    )}
                                </Field>
                            </InputRow>

                            {/* Send Again */}
                            <SendAgainText
                                data-cy="send-again"
                                onClick={sendAgain}>
                                Didn’t receive an email? Click here to send again
                            </SendAgainText>
                        </InputContainer>

                        {/* auto submit trigger */}
                        <AutoSubmit />
                    </Form>
                </FormContainer>
            )
        }}
        </Formik>
    )
}
export default EnterCode;