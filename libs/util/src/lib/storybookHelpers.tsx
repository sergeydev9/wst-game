import { Provider } from "react-redux";
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { Story as StoryType } from "@storybook/react";
import { configureStore, Reducer, Store } from '@reduxjs/toolkit';
import { enhancer } from 'addon-redux';


/**
 * Elements that contain router links need to be wrapped in a router provider.
 * This decorator takes care of that.
 *
 * To use this, add it to the decorators array at the top of the story.
 *
 * @example
 *
 * export default {
 *   component: MyComponent,
 *   title: "My Component"
 *   decorators: [routerDecorator]
 * }
 */
export const routerDecorator = (Story: StoryType) => {
    const history = createBrowserHistory();
    return <Router history={history}><Story /></Router>
}