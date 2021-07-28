import Input from "./TextInput";

export default {
    component: Input,
    title: "Text input"
}

const Template = () => {
    return (
        <Input type="text" placeholder="4 letter game code" />
    )
}

export const TextInput = Template.bind({})