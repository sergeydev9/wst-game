import Boxed, { BoxProps } from './BoxedSpan';
import { LargeTitle } from '../typography/typography';
import { Story, Meta } from '@storybook/react';


export default {
    component: Boxed,
    title: "Page Sections/Boxed Span",
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
        <Boxed {...args} >
            <LargeTitle>Binge watched an entire season of a show in a weekend?</LargeTitle>
        </Boxed >
    )
}

export const BoxedSpan = Template.bind({});

BoxedSpan.args = {
    $light: false
}
