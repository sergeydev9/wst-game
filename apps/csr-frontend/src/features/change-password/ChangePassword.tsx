import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { passwordValidationObject } from '@whosaidtrue/util';
import { api } from '../../api';
import {
    TextInput,
    FormGroup,
    Button,
    InputLabel,
    ErrorText,
    Headline,
    Title2
} from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { closeModals } from '../modal/modalSlice';


const ChangePassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const [changeErr, setChangeErr] = useState('')

    const formik = useFormik({
        initialValues: {
            oldPass: '',
            newPass: '',
            confPass: ''
        },
        validationSchema: Yup.object({
            oldPass: Yup.string().required('You must enter your old password'),
            newPass: passwordValidationObject,
            confPass: Yup.string().oneOf([Yup.ref('newPass'), null], 'Passwords do not match').required('Must confirm new password')
        }),
        onSubmit: async (values) => {
            const { oldPass, newPass } = values
            try {
                await api.patch('/user/change-password', { oldPass, newPass })
                dispatch(closeModals())
            } catch (e) {
                setChangeErr(e.response.data)
            }
        }
    })

    const oldPwErr = formik.touched.oldPass && formik.errors.oldPass ? true : undefined
    const newPwErr = formik.touched.newPass && formik.errors.newPass ? true : undefined
    const confPwErr = formik.touched.confPass && formik.errors.confPass ? true : undefined

    return (
        <div className="text-center px-8 py-11 w-change-password rounded-3xl bg-white-ish border-0">
            <form className="w-full flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                {/* title */}
                <FormGroup>
                    <Title2 className="text-center">Change Password</Title2>
                    {changeErr && <ErrorText>{changeErr}</ErrorText>}
                </FormGroup>

                {/* oldPass */}
                <FormGroup>
                    <InputLabel htmlFor="oldPass">Old Password</InputLabel>
                    <TextInput {...formik.getFieldProps('oldPass')} id="oldPass" $hasError={oldPwErr} $border name="oldPass" type="password" />
                    {oldPwErr ? (<ErrorText>{formik.errors.oldPass}</ErrorText>) : null}
                </FormGroup>

                {/* newPass */}
                <FormGroup>
                    <InputLabel htmlFor="newPass">New Password</InputLabel>
                    <TextInput {...formik.getFieldProps('newPass')} id="newPass" $hasError={newPwErr} $border name="newPass" type="password" />
                    {newPwErr ? (<ErrorText>{formik.errors.newPass}</ErrorText>) : null}
                </FormGroup>

                {/* confPass */}
                <FormGroup>
                    <InputLabel htmlFor="confPass">Confirm New Password</InputLabel>
                    <TextInput {...formik.getFieldProps('confPass')} id="confPass" $hasError={confPwErr} $border name="confPass" type="password" />
                    {confPwErr ? (<ErrorText>{formik.errors.confPass}</ErrorText>) : null}
                </FormGroup>
                <div className="px-32 mt-4">
                    <Button type="submit" >Change Password</Button>
                </div>
            </form>
            <Headline className="text-basic-gray underline cursor-pointer mt-10">Forgot Password?</Headline>
        </div>
    )
}
export default ChangePassword;