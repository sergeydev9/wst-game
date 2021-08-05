import Nav from './Navbar';
import authReducer from '../auth/authSlice';
import { routerDecorator, createStore, storeDecorator } from '@whosaidtrue/util';
import { withReactContext } from 'storybook-react-context';
import { Story as StoryType, Meta } from "@storybook/react";
import { ARG_REDUX_PATH } from 'addon-redux';

const store = createStore([{ reducer: authReducer, key: 'auth' }]);

export default {
    component: Nav,
    title: 'Sections/Navbar',
    decorators: [withReactContext, routerDecorator, storeDecorator(store)],
    argTypes: {
        loggedIn: {
            [ARG_REDUX_PATH]: 'auth.status',
            control: {
                type: 'select',
                options: ["loggedIn", "loggedOut", "loading", "failed"]
            }
        }
    }

} as Meta;

const Template: StoryType = (args) => {
    return <Nav />

}

export const LoggedIn = Template.bind({})

LoggedIn.args = {
    loggedIn: "loggedIn"
}

export const loggedOut = Template.bind({})

loggedOut.args = {
    loggedIn: "loggedOut"
}