import FormComponent from './Form';
import { Title1 } from '../typography/Typography';
import Box from '../box/Box';
import InputLabel from '../input-label/InputLabel';
import TextInput from '../text-input/TextInput';
import Button from '../button/Button';

export default {
    component: FormComponent,
    title: "Layouts/Form"
}

export const FormContainer = () => {
    return (
        <Box $light>
            <FormComponent>
                <Title1>Play as Guest Host</Title1>
                <div className="text-left">
                    <InputLabel>Email Address</InputLabel>
                    <TextInput />
                </div>

                <Button fontSize="label-big">Continue</Button>
            </FormComponent>
        </Box>
    )
}