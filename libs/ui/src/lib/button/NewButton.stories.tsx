import { Story, Meta } from '@storybook/react';
import Button, { ButtonProps } from './NewButton';

export default {
    component: Button,
    title: 'Buttons',
    argTypes: {
        buttonStyle: {
            name: 'buttonStyle',
            default: "default",
            description: "Select one of the styles of button from the design language.",
            control: {
                type: 'select',
            },
            table: {
                type: { required: false, summary: "Button Style", detail: `"default" | "big-text" | "small" | "iniline"` },
                defaultValue: { summary: "default" },
            },
            options: ["default", "big-text", "small", "iniline"]
        },

    },
    $secondary: {
        name: '$secondary',
        description: "Each style has a primary and secondary variant. Add this prop to switch to the secondary",
        type: 'boolean',
        default: false,
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'false' }
        },
    }
} as Meta;

export const Buttons: Story<ButtonProps> = (args) => <Button {...args} >Button</Button>