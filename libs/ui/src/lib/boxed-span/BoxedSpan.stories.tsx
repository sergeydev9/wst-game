import BoxedSpan, { BoxProps } from './BoxedSpan';
import SectionHeader from '../section-header/SectionHeader';
import { Story, Meta } from '@storybook/react';


export default {
    component: BoxedSpan,
    title: "Boxed Span",
    argTypes: {
        light: {
            type: 'boolean',
            default: false
        }
    }
} as Meta;

const Template: Story<BoxProps> = (args) => {
    return (
        <BoxedSpan {...args}>
            <SectionHeader>Binge watched an entire season of a show in a weekend?</SectionHeader>
        </BoxedSpan >
    )
}

export const Boxed = Template.bind({});

Boxed.args = {
    light: false
}