import Input, { TextInputProps } from "./TextInput";
import { Meta, Story } from "@storybook/react";

export default {
    component: Input,
    title: "Inputs/Text Input",
    argTypes: {
        $border: {
            name: '$border',
            type: 'boolean',
            default: true

        }
    }
} as Meta;


export const TextInput: Story<TextInputProps> = (args) => <div className="w-56"><Input {...args} type="text" placeholder="4 letter game code" /></div>

TextInput.args = {
    $border: true
}