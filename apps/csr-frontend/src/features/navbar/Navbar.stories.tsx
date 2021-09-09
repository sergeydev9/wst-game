import Nav from './Navbar';
import { routerDecorator } from '@whosaidtrue/util';
import { withReactContext } from 'storybook-react-context';
import { Story as StoryType, Meta } from "@storybook/react";
import { ARG_REDUX_PATH } from 'addon-redux';

export default {
    component: Nav,
    title: 'Sections/Navbar',
    decorators: [withReactContext, routerDecorator],
    argTypes: {
        loggedIn: {
            [ARG_REDUX_PATH]: 'auth.status',
            table: {
                disable: true
            }
        },
        inGame: {
            [ARG_REDUX_PATH]: 'game.status',
            table: {
                disable: true
            }
        },
        playerName: {
            [ARG_REDUX_PATH]: 'game.playerName',
            table: {
                disable: true
            }
        },
    }

} as Meta;

const Template: StoryType = () => {
    return <Nav />

}

export const LoggedIn = Template.bind({})

LoggedIn.args = {
    loggedIn: "loggedIn",
}

export const LoggedOut = Template.bind({})

LoggedOut.args = {
    loggedIn: "loggedOut",
}

export const InGame = Template.bind({})

InGame.args = {
    loggedIn: "loggedIn",
    inGame: "playing",
    playerName: 'Mystic Tycoon'
}