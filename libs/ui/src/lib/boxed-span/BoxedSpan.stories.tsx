import Boxed, { BoxProps } from './BoxedSpan';
import { LargeTitle } from '../typography/typography';
import { Story, Meta } from '@storybook/react';


export default {
    component: Boxed,
    title: "Boxed Span"
} as Meta;

const Template: Story<BoxProps> = () => {
    return (
        <Boxed >
            <LargeTitle>Binge watched an entire season of a show in a weekend?</LargeTitle>
        </Boxed >
    )
}

export const BoxedSpan = Template.bind({});
