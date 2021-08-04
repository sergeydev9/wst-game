import BoxComponent, { BoxProps } from './Box';
import { LargeTitle } from '../typography/Typography';
import Button from '../button/Button';
import { Story, Meta } from '@storybook/react';


export default {
    component: BoxComponent,
    title: "Page Sections/Box",
    argTypes: {
        $light: {
            name: '$light',
            type: 'boolean',
            description: 'Toggle between the two box styles',
            default: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        $horizontal: {
            name: '$horizontal',
            type: 'boolean',
            description: 'Choose the flex orientation of the box',
            default: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        }
    }
} as Meta;

const VerticalTemplate: Story<BoxProps> = (args) => {
    return (
        <BoxComponent className="gap-6" {...args} >
            <LargeTitle>Binge watched an entire season of a show in a weekend?</LargeTitle>
            <Button>Press me!</Button>
        </BoxComponent >
    )
}

export const VerticalBox = VerticalTemplate.bind({});

VerticalBox.args = {
    $light: false,
    $horizontal: false
}

const HorizontalTemplate: Story<BoxProps> = (args) => {
    return (
        <BoxComponent className="gap-6" {...args} >
            <LargeTitle>Binge watched an entire season of a show in a weekend?</LargeTitle>
            <Button>Press me!</Button>
        </BoxComponent >
    )
}

export const HorizontalBox = HorizontalTemplate.bind({})

HorizontalBox.args = {
    $light: false,
    $horizontal: true
}
