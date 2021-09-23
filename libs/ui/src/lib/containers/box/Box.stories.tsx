import BoxComponent, { BoxProps } from './Box';
import { LargeTitle } from '../../typography/Typography';
import Button from '../../button/Button';
import { Story, Meta } from '@storybook/react';


export default {
    component: BoxComponent,
    title: "Page Sections/Box",
    argTypes: {
        boxStyle: {
            name: 'boxStyle',
            type: 'select',
            description: 'Selects the box style',
            table: {
                type: { summary: 'string', details: '"white" | "light-gray" | "purple-subtle"' },
            },
            options: ['white', 'light-gray', 'purple-subtle']
        },
        $dropShadow: {
            name: '$dropShadow',
            type: 'boolean',
            description: 'Adds a light drop shadow to the box',
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
    boxstyle: 'purple-subtle',
    $horizontal: false,
    $dropShadow: false
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
    boxstyle: 'purple-subtle',
    $horizontal: true,
    $dropShadow: false
}
