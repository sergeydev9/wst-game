import FormButton from './FormButton';

export default {
    component: FormButton,
    title: "Form Button"
}

const Template = () => {
    return <FormButton type="button">Submit</FormButton>
}

export const Button = Template.bind({})