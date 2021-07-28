import Button, { SolidButtonProps } from "./BlueSolidButton";
import { Story, Meta } from "@storybook/react";

export default {
    component: Button,
    title: "Blue Solid Button",
    argTypes: {
        light: {
            type: 'boolean',
            default: false
        }
    }
} as Meta;

const Template: Story<SolidButtonProps> = (args) => {
    return (
        <Button {...args}>Login or Sign up</Button>
    )
}

export const BlueButton = Template.bind({})

BlueButton.args = {
    light: false
}