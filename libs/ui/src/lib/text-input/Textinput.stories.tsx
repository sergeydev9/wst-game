import Input from "./TextInput";
import { Story, Meta } from "@storybook/react";

export default {
    component: Input,
    title: "Text Input",
    argTypes: {
        light: {
            type: 'boolean',
            default: false
        }
    }
} as Meta;

const Template = () => {
    return (
        <Input type="text" placeholder="4 letter game code" />
    )
}

export const TextInput = Template.bind({})