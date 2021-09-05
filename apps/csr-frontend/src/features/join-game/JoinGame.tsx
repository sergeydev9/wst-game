import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from "react-router";

import { Title1, TextInput, Button, ErrorText } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { initialRequest } from '../game/gameSlice';

const JoinGame: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const errMsg = 'Invalid game code';

    const formik = useFormik({
        initialValues: {
            accessCode: ''
        },

        validationSchema: Yup.object({
            accessCode: Yup.string().length(6, errMsg).required(errMsg)
        }),
        onSubmit: values => {
            dispatch(initialRequest(values.accessCode))
            history.push(`/x/${values.accessCode}`)
        }
    })

    const codeError = formik.touched.accessCode && formik.errors.accessCode ? true : undefined
    return (
        <section className="text-left w-full h-full py-8 px-6">
            <Title1 className="mb-7 text-center">Join a Game</Title1>
            <form className="flex flex-row gap-4 items-center" onSubmit={formik.handleSubmit}>
                <TextInput $hasError={codeError} className="flex-2 mb-2" $border placeholder="Enter Game Code" {...formik.getFieldProps('accessCode')} />
                <Button type="submit" className="flex-1">Join Game!</Button>
            </form>
            {codeError ? (<ErrorText>{formik.errors.accessCode}</ErrorText>) : null}
        </section>
    )
}

export default JoinGame