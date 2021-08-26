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
        <section className="text-center w-full h-full py-8 px-6">
            <Title1 className="mb-7">Join a Game</Title1>
            <form className="flex flex-row gap-4 items-center" onSubmit={formik.handleSubmit}>
                <TextInput className="flex-2" $border placeholder="Enter Game Code" {...formik.getFieldProps('accessCode')} />
                <Button type="submit" className="flex-1">Join Game!</Button>
            </form>
            {formik.touched.accessCode && formik.errors.accessCode ? (<div className="text-red-light mt-2">{formik.errors.accessCode}</div>) : null}
        </section>
    )
}

export default JoinGame