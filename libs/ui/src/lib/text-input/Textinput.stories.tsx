import Input from "./TextInput";
import { Meta } from "@storybook/react";

export default {
    component: Input,
    title: "Inputs/Text Input",
    argTypes: {
        light: {
            type: 'boolean',
            default: false
        }
    }
} as Meta;


export const TextInput = () => <Input type="text" placeholder="4 letter game code" />