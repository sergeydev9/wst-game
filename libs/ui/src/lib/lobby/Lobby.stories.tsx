import LobbyComponent, { LobbyProps } from './Lobby';
import { Story } from '@storybook/react'

export default {
    component: LobbyComponent,
    title: 'Page Sections/Lobby'
}

const Template: Story<LobbyProps> = (args) => (
    <LobbyComponent {...args} />)

export const SixPlayers = Template.bind({})

SixPlayers.args = {
    otherPlayers: [
        'Tipsy Sailor',
        'Chuffed Caterpillar',
        'Mystic Raccoon',
        'Angry Tortoise',
        'Derelict Giraffe',
    ],
    isHost: false,
    handlerFactory: (n) => () => console.log(n),
    playerName: "Naughty Walrus",
    footerMessage: "The host will start the game once all players have joined."
}

export const OnePlayer = Template.bind({});

OnePlayer.args = {
    otherPlayers: [],
    isHost: false,
    handlerFactory: (n) => () => console.log(n),
    playerName: "Naughty Walrus",
    footerMessage: "The host will start the game once all players have joined."
}

export const TenPlayers = Template.bind({});

TenPlayers.args = {
    otherPlayers: [
        'Tipsy Sailor',
        'Chuffed Caterpillar',
        'Mystic Raccoon',
        'Angry Tortoise',
        'Derelict Giraffe',
        'Cool Curie',
        'Neurotic Einstein',
        'Trash Bonaparte',
        'Impulsive Coconut',
    ],
    isHost: false,
    handlerFactory: (n) => () => console.log(n),
    playerName: "Naughty Walrus",
    footerMessage: "The host will start the game once all players have joined."
}

export const TenPlayersHost = Template.bind({});

TenPlayersHost.args = {
    otherPlayers: [
        'Tipsy Sailor',
        'Chuffed Caterpillar',
        'Mystic Raccoon',
        'Angry Tortoise',
        'Derelict Giraffe',
        'Cool Curie',
        'Neurotic Einstein',
        'Trash Bonaparte',
        'Impulsive Coconut'
    ],
    isHost: true,
    handlerFactory: (n) => () => console.log(n),
    playerName: "Naughty Walrus",
    footerMessage: "The host will start the game once all players have joined."
}