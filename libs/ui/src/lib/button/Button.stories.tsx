import Button, { ButtonProps } from './Button';
import { THEME_COLORS } from "@whosaidtrue/util";
import { Story, Meta } from '@storybook/react';

export default {
    component: Button,
    title: "Buttons",
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
                defaultValue: { summary: "primary" },
            },
            options: THEME_COLORS, // imports from util lib
        },
        fontSize: {
            name: "fontSize",
            default: "headline",
            description: "Selects a theme preset font-size for the button label",
            table: {
                type: { summary: "Font Size", detail: '"headline" | "label-big" | "label-small"' },
                defaultValue: { summary: "headline" }
            },
            control: {
                type: 'select',
            },
            options: ["headline", "label-big", "label-small"]
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
        boxshadow: {
            name: 'boxshadow',
            description: 'Applies box-shadow presets to the element',
            type: 'string',
            control: {
                type: 'select',
            },
            options: ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', undefined],
            table: {
                type: { summary: 'Box-Shadow Preset', detail: '"shadow-sm" | "shadow" | "shadow-md" | "shadow-lg" | "shadow-xl" | "shadow-2xl" | undefined' },
                defaultValue: { summary: 'undefined' }
            }
        }
    },



} as Meta;

const Template: Story<ButtonProps> = ({ color, fontSize, border, boxshadow, $small, $pill }) => (
    <Button
        color={color}
        fontSize={fontSize}
        border={border}
        boxshadow={boxshadow}
        $small={$small}
        $pill={$pill}>
        Button Component
    </Button>
)

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
    color: "primary",
    fontSize: "headline",
    boxshadow: undefined,
    $small: false,
    $pill: false,
    border: undefined,
}

export const SolidSubtleStroke = () => <Button color="subtle-stroke">Subtle Stroke</Button>

export const BorderPrimary = () => <Button border="medium">Border</Button>

export const BorderSubtleStroke = () => <Button color="subtle-stroke" border="medium">Border Subtle Stroke</Button>

export const SolidSmall = () => <Button $small>Solid Small</Button>

export const BorderSmall = () => <Button border="medium" $small>Border Small</Button>

export const LargeSolidPill = () => <Button $pill>Large Solid Pill</Button>

export const LargeBorderPill = () => <Button border="medium" $pill >Large Border Pill</Button>

export const SmallSolidPill = () => <Button $pill $small>Small Solid Pill</Button>

export const SmallBorderPill = () => <Button border="medium" $pill $small >Small</Button>

export const boxshadowPrimary = () => {
    // ignore containing div
    return (
        <div className="bg-blue-200 py-8 flex justify-center flex-row">
            <Button color="primary" boxshadow="shadow-lg" border="medium" $pill >Large pill with box shadow</Button>
        </div>
    )
}
