import Button, { ButtonProps } from './Button';
import { THEME_COLORS } from "@whosaidtrue/util";
import { Story, Meta } from '@storybook/react';

export default {
    component: Button,
    title: "Buttons",
    argTypes: {
        color: {
            type: 'select',
            options: THEME_COLORS, // imports from util lib
            default: 'primary'
        },
        $small: {
            type: 'boolean',
            default: false
        },
        $border: {
            type: 'boolean',
            default: false
        },
        $pill: {
            type: 'boolean',
            default: false
        },
        boxshadow: {
            type: 'select',
            options: ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl']
        }

    },
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    }


} as Meta;

const Template: Story<ButtonProps> = ({ color, $small, $border, $pill, boxshadow }) => (
    <Button color={color} $small={$small} $pill={$pill} $border={$border} boxshadow={boxshadow}>Button Component</Button>
)

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
    color: "primary",
    boxshadow: undefined,
    $small: false,
    $border: false,
    $pill: false,

}

export const SolidSubtleStroke = () => <Button color="subtle-stroke">Subtle Stroke</Button>

export const BorderPrimary = () => <Button color="primary" $border>Border</Button>

export const BorderSubtleStroke = () => <Button color="subtle-stroke" $border>Border Subtle Stroke</Button>

export const SolidSmall = () => <Button color="primary" $small>Solid Small</Button>

export const BorderSmall = () => <Button color="primary" $border $small>Border Small</Button>

export const LargeSolidPill = () => <Button color="primary" $pill>Large Solid Pill</Button>

export const LargeBorderPill = () => <Button color="primary" $pill $border>Large Border Pill</Button>

export const SmallSolidPill = () => <Button color="primary" $pill $small>Small Solid Pill</Button>

export const SmallBorderPill = () => <Button color="primary" $pill $small $border>Small</Button>

export const BoxShadowPrimary = () => {
    // ignore containing div
    return (
        <div className="bg-blue-200 py-8 flex justify-center flex-row">
            <Button color="primary" boxshadow="shadow-lg" $pill $border>Large pill with box shadow</Button>
        </div>
    )
}
