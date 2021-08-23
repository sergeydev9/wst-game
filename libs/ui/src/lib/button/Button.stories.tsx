import Button, { ButtonProps } from './Button';
import { THEME_COLORS } from "@whosaidtrue/util";
import { Story, Meta } from '@storybook/react';

export default {
    component: Button,
    title: "Buttons/Default Button",
    argTypes: {
        color: {
            name: 'color',
            default: "primary",
            description: "Applies a theme color to the element.",
            control: {
                type: 'select',
            },
            table: {
                type: { required: false, summary: "Theme Color", detail: `"${THEME_COLORS.join('" \n|"')}" \n| undefined` },
                defaultValue: { summary: "blue-base" },
            },
            options: THEME_COLORS, // imports from util lib
        },
        fontSize: {
            name: "fontSize",
            default: "headline",
            description: "Selects a theme preset font-size for the button label",
            table: {
                type: { summary: "Font Size", detail: '"headline" | "label-big" | "label-small" | "jumbo"' },
                defaultValue: { summary: "headline" }
            },
            control: {
                type: 'select',
            },
            options: ["headline", "label-big", "label-small", "jumbo"]
        },
        border: {
            name: "border",
            default: undefined,
            description: "If specified, gives the button a white background, changes the text color, and sets the border to the desired thickness",
            table: {
                type: { summary: "thickness", detail: '"thin" | "medium" | "thick" | undefined' },
                defaultValue: { summary: 'undefined' }
            },
            control: {
                type: 'select'
            },
            options: ['thin', 'medium', 'thick', undefined],

        },
        $small: {
            name: '$small',
            description: "Sets the size of the button",
            type: 'boolean',
            default: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            },
        },
        $pill: {
            name: '$pill',
            description: 'Makes the button pill shaped',
            type: 'boolean',
            default: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
    },



} as Meta;

const Template: Story<ButtonProps> = ({ color, fontSize, border, $small, $pill }) => (
    <Button
        color={color}
        fontSize={fontSize}
        border={border}
        $small={$small}
        $pill={$pill}>
        Button Component
    </Button>
)

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
    color: "blue-base",
    fontSize: "headline",
    $small: false,
    $pill: false,
    border: undefined,
}

export const SolidSubtleStroke = () => <Button color="purple-subtle-stroke">Subtle Stroke</Button>

export const BorderPrimary = () => <Button border="medium">Border</Button>

export const BorderSubtleStroke = () => <Button color="purple-subtle-stroke" border="medium">Border Subtle Stroke</Button>

export const SolidSmall = () => <Button $small>Solid Small</Button>

export const BorderSmall = () => <Button border="medium" $small>Border Small</Button>

export const LargeSolidPill = () => <Button $pill>Large Solid Pill</Button>

export const LargeBorderPill = () => <Button border="medium" $pill >Large Border Pill</Button>

export const SmallSolidPill = () => <Button $pill $small>Small Solid Pill</Button>

export const SmallBorderPill = () => <Button border="medium" $pill $small >Small</Button>