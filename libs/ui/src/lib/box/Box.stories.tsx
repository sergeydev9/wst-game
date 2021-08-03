import BoxComponent, { BoxProps } from './Box';
import { LargeTitle } from '../typography/typography';
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
        }
    }
} as Meta;

const Template: Story<BoxProps> = (args) => {
    return (
        <BoxComponent {...args} >
            <LargeTitle>Binge watched an entire season of a show in a weekend?</LargeTitle>
        </BoxComponent >
    )
}

export const Box = Template.bind({});

Box.args = {
    $light: false
}
