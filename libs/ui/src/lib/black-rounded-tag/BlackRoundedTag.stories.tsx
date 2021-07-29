import Tg from "./BlackRoundedTag";
import { TagProps } from './BlackRoundedTag';
import { Story, Meta } from '@storybook/react';


export default {
    component: Tg,
    title: "Black Rounded Tag",
    argTypes: {
        selected: {
            type: 'boolean',
            default: true
        }
    }
} as Meta;

const Template: Story<TagProps> = (args) => {
    return (
        <Tg {...args}>Work Friendly</Tg>
    )
}

export const BlackRoundedTag = Template.bind({});

BlackRoundedTag.args = {
    selected: true
}
