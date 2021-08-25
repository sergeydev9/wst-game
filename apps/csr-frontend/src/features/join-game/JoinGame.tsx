import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from "react-router-dom";

import { Title1, TextInput, Button } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { initialRequest } from '../game/gameSlice';

const JoinGame: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            accessCode: ''
        },

        validationSchema: Yup.object({
            accessCode: Yup.string().length(6, 'Invalid game code')
        }),
        onSubmit: values => {
            dispatch(initialRequest(values.accessCode))
            history.push(`/join?access_code=${values.accessCode}`)
        }
    })

    return (
        <section className="flex flex-col gap-4 items-center p-8">
            <Title1>Join a Game</Title1>
            <form onSubmit={formik.handleSubmit} className="flex flex-row gap-6">
                <TextInput $border placeholder="Enter Game Code" {...formik.getFieldProps('accessCode')} />
                <Button type="submit" className="w-max">Join Game!</Button>
            </form>
            {formik.touched.accessCode && formik.errors.accessCode ? (<div className="text-red-light mt-2">{formik.errors.accessCode}</div>) : null}
        </section>
    )
}

export default JoinGame