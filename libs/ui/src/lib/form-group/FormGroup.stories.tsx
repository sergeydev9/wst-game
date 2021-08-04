import FormGroupComponent from './FormGroup';
import InputLabel from '../input-label/InputLabel';
import TextInput from '../text-input/TextInput';
import FormContainer from '../form-container/FormContainer';

export default {
    component: FormGroupComponent,
    title: 'Layouts/Form Group'
}

export const FormGroup = () => {
    return (
        <FormContainer>
            <FormGroupComponent>
                <InputLabel>Email</InputLabel>
                <TextInput />
            </FormGroupComponent>
        </FormContainer>

    )
}