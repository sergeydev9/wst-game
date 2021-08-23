import Lobby from './Lobby';
import { Story, Meta } from '@storybook/react';

export default {
    component: Lobby,
    title: "Pages/lobby"
} as Meta

const Template: Story = (args) => {
    return <Lobby {...args} />
}

export const ChooseName = Template.bind({});

export const WaitingForGameStart = Template.bind({});

export const WaitingForNextQuestion = Template.bind({})