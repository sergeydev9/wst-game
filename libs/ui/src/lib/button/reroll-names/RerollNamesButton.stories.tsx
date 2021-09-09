import RerollButtonComponent, { RerollButtonProps } from "./RerollNames";
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

const Template: Story<RerollButtonProps> = (args) => <div className="w-max"><RerollButtonComponent {...args} /></div>

export const HasRerolls = Template.bind({});

HasRerolls.args = {
    rerolls: 3
}

export const NoRerolls = Template.bind({});

NoRerolls.args = {
    rerolls: 0
}