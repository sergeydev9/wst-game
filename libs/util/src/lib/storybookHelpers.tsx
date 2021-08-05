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


export interface ReducerConfig {
    reducer: Reducer;
    key: string;
}

/**
 * Create redux stores that can be used in decorators for components
 * that need redux.
 *
 * Takes care of adding enhancer for storybook addon.
 *
 * Key must match the key in the application that the component expects.
 *
 * @param {ReducerConfig[]} configs an array of objects. Each has a reducer with its associated key.
 *
 * @returns {Store} a configured redux store object with storybook added enhancer
 */
export const createStore = (configs: ReducerConfig[]) => {
    const reducerObj = {} as any;
    configs.forEach(({ reducer, key }) => reducerObj[key] = reducer)
    return configureStore({
        reducer: reducerObj,
        enhancers: [enhancer]
    })
}

/**
 * Create a story decorator that provides a configured store.
 *
 * @param {Store} store a configured redux store
 *
 * @returns {(story: Story) => Provider} Story decorator function.
 */
export const storeDecorator = (store: Store) => (Story: StoryType) => {
    return <Provider store={store}><Story /></Provider>
}