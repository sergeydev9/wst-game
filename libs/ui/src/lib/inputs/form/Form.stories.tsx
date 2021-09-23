import FormComponent from './Form';
import { Title1 } from '../../typography/Typography';
import Box from '../../containers/box/Box';
import InputLabel from '../input-label/InputLabel';
import TextInput from '../text-input/TextInput';
import Button from '../../button/Button';

export default {
    component: FormComponent,
    title: "Page Sections/Form"
}

export const Form = () => {
    return (
        <Box boxstyle='light-gray'>
            <FormComponent>
                <Title1>Play as Guest Host</Title1>
                <div className="text-left">
                    <InputLabel>Email Address</InputLabel>
                    <TextInput $border />
                </div>

                <Button>Continue</Button>
            </FormComponent>
        </Box>
    )
}