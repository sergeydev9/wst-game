import LNav from './LargeNav';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";


export default {
    component: LNav,
    title: 'Large Nav'
}

const Template = () => {
    const history = createBrowserHistory();
    return <Router history={history}><LNav /></Router>
}

export const LargeNav = Template.bind({})