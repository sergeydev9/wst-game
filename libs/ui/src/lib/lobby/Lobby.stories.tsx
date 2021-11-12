import LobbyComponent, { LobbyProps } from './Lobby';
import { Story } from '@storybook/react'
import OneLiners from '../one-liners/OneLiners';

export default {
    component: LobbyComponent,
    title: 'Gameplay/Lobby'
}

const Template: Story<LobbyProps> = (args) => (
    <LobbyComponent {...args}>
        <OneLiners>
            'Tis but a flesh wound
        </OneLiners>
    </LobbyComponent>
)

export const SixPlayers = Template.bind({})

SixPlayers.args = {
    otherPlayers: [
        { id: 1, player_name: 'Tipsy Sailor' },
        { id: 2, player_name: 'Chuffed Caterpillar' },
        { id: 3, player_name: 'Mystic Raccoon' },
        { id: 4, player_name: 'Angry Tortoise' },
        { id: 5, player_name: 'Derelict Giraffe' },
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
        { id: 1, player_name: 'Tipsy Sailor' },
        { id: 2, player_name: 'Chuffed Caterpillar' },
        { id: 3, player_name: 'Mystic Raccoon' },
        { id: 4, player_name: 'Angry Tortoise' },
        { id: 5, player_name: 'Derelict Giraffe' },
        { id: 6, player_name: 'Cool Curie' },
        { id: 7, player_name: 'Neurotic Einstein' },
        { id: 8, player_name: 'Trash Bonaparte' },
        { id: 9, player_name: 'Impulsive Coconut' }
    ],
    isHost: false,
    handlerFactory: (n) => () => console.log(n),
    playerName: "Naughty Walrus",
    footerMessage: "The host will start the game once all players have joined."
}

export const TenPlayersHost = Template.bind({});

TenPlayersHost.args = {
    otherPlayers: [
        { id: 1, player_name: 'Tipsy Sailor' },
        { id: 2, player_name: 'Chuffed Caterpillar' },
        { id: 3, player_name: 'Mystic Raccoon' },
        { id: 4, player_name: 'Angry Tortoise' },
        { id: 5, player_name: 'Derelict Giraffe' },
        { id: 6, player_name: 'Cool Curie' },
        { id: 7, player_name: 'Neurotic Einstein' },
        { id: 8, player_name: 'Trash Bonaparte' },
        { id: 9, player_name: 'Impulsive Coconut' },
        { id: 10, player_name: 'Legendary Ranger' }

    ],
    isHost: true,
    handlerFactory: (n) => () => console.log(n),
    playerName: "Naughty Walrus",
    footerMessage: "The host will start the game once all players have joined."
}