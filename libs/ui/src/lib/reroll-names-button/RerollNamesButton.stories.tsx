import RerollButtonComponent, { RerollButtonProps } from "./RerollNamesButton";
import { Story, Meta } from "@storybook/react";

export default {
    component: RerollButtonComponent,
    title: "Buttons/Reroll Names Button",
    argTypes: {
        rerolls: {
            name: 'rerolls',
            default: 3,
            control: {
                type: 'number'
            }

        }
    }
}

const Template: Story<RerollButtonProps> = (args) => <RerollButtonComponent {...args} />

export const HasRerolls = Template.bind({});

HasRerolls.args = {
    rerolls: 3
}

export const NoRerolls = Template.bind({});

NoRerolls.args = {
    rerolls: 0
}