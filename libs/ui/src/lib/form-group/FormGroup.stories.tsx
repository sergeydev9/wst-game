import FormGroupComponent from './FormGroup';
import InputLabel from '../input-label/InputLabel';
import TextInput from '../text-input/TextInput';
import Form from '../form/Form';

export default {
    component: FormGroupComponent,
    title: 'Page Sections/Form Group'
}

export const FormGroup = () => {
    return (
        <Form>
            <FormGroupComponent>
                <InputLabel>Email</InputLabel>
                <TextInput />
            </FormGroupComponent>
        </Form>
    )
}