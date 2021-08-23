import BlackRoundedTag from "./BlackRoundedTag";
import { TagProps } from './BlackRoundedTag';
import { Story, Meta } from '@storybook/react';


export default {
    component: BlackRoundedTag,
    title: "Tags/Black Rounded",
    argTypes: {
        selected: {
            type: 'boolean',
            default: true
        }
    }
} as Meta;

const Template: Story<TagProps> = (args) => {
    return (
        <BlackRoundedTag {...args}>Work Friendly</BlackRoundedTag>
    )
}

export const BlackRounded = Template.bind({});

BlackRounded.args = {
    selected: true
}
