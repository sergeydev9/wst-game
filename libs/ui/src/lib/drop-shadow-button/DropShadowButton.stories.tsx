import DropShadowButtonComponent, { IDSButtonProps } from "./DropShadowButton";
import { Story, Meta } from "@storybook/react";

export default {
    component: DropShadowButtonComponent,
    title: "Drop Shadow Button",
    default: "border-light",
    argTypes: {
        buttonstyle: {
            name: 'buttonstyle',
            description: 'Select one of the possible styles for this button',
            control: {
                type: 'select'
            },
            table: {
                type: { required: true, summary: "Button Style", detail: '"solid" | "border-light" | "border-thick"' }
            },
            options: ["solid", "border-light", "border-thick"]
        },

    }
} as Meta;

const Template: Story<IDSButtonProps> = ({ buttonstyle }) => {
    return <DropShadowButtonComponent buttonstyle={buttonstyle}>Drop Shadow Button</DropShadowButtonComponent>
}

export const DropShadowButton = Template.bind({});

DropShadowButton.args = {
    buttonstyle: "border-light"
}