import React, { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router';
import { ResetCodeVerificationResponse } from '@whosaidtrue/api-interfaces';
import { Formik, useFormikContext } from 'formik';
import { api } from '../../api';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setToken, selectResetEmail, clearReset } from './resetPasswordSlice';
import { SecurityCodeDigit as Digit, Title3, Title1, ErrorText, Headline } from '@whosaidtrue/ui';

// get the form, and methods from context. Submit as soon
// as form is valid
const AutoSubmit: React.FC = () => {
    const { values, submitForm, isValid, } = useFormikContext<{ char1: string, char2: string, char3: string, char4: string }>();

    useEffect(() => {
        if (values.char1 && values.char2 && values.char3 && values.char4) {
            isValid && submitForm();
        }
    }, [values, submitForm, isValid]);
    return null;
};

export interface SecurityCodeDigitProps extends React.InputHTMLAttributes<HTMLInputElement> {
    $hasError?: boolean
}

interface DigitProps extends SecurityCodeDigitProps {
    forwardRef: React.Ref<HTMLInputElement>


}
// need to make this component to pass the ref along
const SecurityCodeDigit: React.FC<DigitProps> = ({ forwardRef, name, ...props }) => (
    <Digit  {...props} name={name} ref={forwardRef} type="text" maxLength={1} size={1} min={0} max={9} pattern="[0-9]{1}" />
)

const EnterCode: React.FC = () => {
    const email = useAppSelector(selectResetEmail); // user email
    const history = useHistory();
    const [error, setError] = useState('')
    const dispatch = useAppDispatch();

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
    const char2Ref = useRef<HTMLInputElement>(null)
    const char3Ref = useRef<HTMLInputElement>(null)
    const char4Ref = useRef<HTMLInputElement>(null)

    // validation object
    const isDigit = Yup.string().matches(/[0-9]{1}/, 'Inputs must be numbers').required()

    return (
        <Formik
            initialValues={{
                char1: '',
                char2: '',
                char3: '',
                char4: ''
            }}
            validationSchema={Yup.object({
                char1: isDigit,
                char2: isDigit,
                char3: isDigit,
                char4: isDigit,
            })}
            onSubmit={async (values, actions) => {
                const { char1, char2, char3, char4 } = values
                const code = `${char1}${char2}${char3}${char4}`

                return api.post<ResetCodeVerificationResponse>('/user/verify-code', { code }).then(response => {
                    const { resetToken } = response.data
                    dispatch(setToken(resetToken))
                    history.push('/reset/new-pass')

                }).catch(e => {
                    if (e.response && e.response.status === 401) {
                        // if 401, code was wrong. Show message, reset form.
                        setError('Incorrect reset code')
                        actions.resetForm();
                    } else {
                        // show an error message, then nav to home.
                        // This only happens if there is a server side problem
                        setError('An unexpected error has occurred, please try again later')
                        setTimeout(() => {
                            dispatch(clearReset())
                            history.push('/')
                        }, 3000)
                    }
                })
            }}

        >{(props) => {

            const validationErr = (props.touched.char1 && props.touched.char2 && props.touched.char3 && props.touched.char4) && (props.errors.char1 || props.errors.char2 || props.errors.char3 || props.errors.char4)

            return (
                <div className="w-2/3 mx-auto py-10 bg-white-ish rounded-3xl filter drop-shadow-card items-center px-6 sm:px-10">
                    <div className="text-center">
                        <Title1 className="text-basic-black">We sent an email to {email}</Title1>
                        {validationErr && <ErrorText>Invalid Code</ErrorText>}
                        {error && <ErrorText>{error}</ErrorText>}
                    </div>
                    <div className="flex flex-col gap-8 rounded-3xl my-6 sm:my-10 py-6 sm:py-10 px-4 sm:px-8 bg-purple-subtle-fill select-none">
                        <Title3 className="text-purple-base self-center text-center">Enter the 4-digit code you received to continue</Title3>
                        <div className="flex flex-row gap-2 sm:gap-4 justify-center select-none">
                            <SecurityCodeDigit name="char1" $hasError={(error || validationErr) ? true : false} forwardRef={char1Ref} onChange={(e: React.ChangeEvent) => {
                                char2Ref.current?.focus();
                                return props.handleChange(e)
                            }} />
                            <SecurityCodeDigit name="char2" $hasError={(error || validationErr) ? true : false} forwardRef={char2Ref} onChange={(e: React.ChangeEvent) => {
                                char3Ref.current?.focus();
                                return props.handleChange(e)
                            }} />
                            <SecurityCodeDigit name="char3" $hasError={(error || validationErr) ? true : false} forwardRef={char3Ref} onChange={(e: React.ChangeEvent) => {
                                char4Ref.current?.focus()
                                return props.handleChange(e)
                            }} />
                            <SecurityCodeDigit name="char4" $hasError={(error || validationErr) ? true : false} forwardRef={char4Ref} onChange={props.handleChange} />
                        </div>

                        <Headline data-cy="send-again" className="text-basic-black underline self-center cursor-pointer text-center" onClick={sendAgain}>Didn’t receive an email? Click here to send again</Headline>
                    </div>
                    <AutoSubmit />
                </div>
            )
        }}

        </Formik>
    )

}
export default EnterCode;