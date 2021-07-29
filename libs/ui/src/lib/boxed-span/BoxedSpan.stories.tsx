import Boxed, { BoxProps } from './BoxedSpan';
import SectionHeader from '../section-header/SectionHeader';
import { Story, Meta } from '@storybook/react';


export default {
    component: Boxed,
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
        <Boxed {...args}>
            <SectionHeader>Binge watched an entire season of a show in a weekend?</SectionHeader>
        </Boxed >
    )
}

export const BoxedSpan = Template.bind({});

BoxedSpan.args = {
    light: false
}