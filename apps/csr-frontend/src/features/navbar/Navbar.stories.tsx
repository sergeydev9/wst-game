import Nav from './Navbar';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';


export default {
    component: Nav,
    title: 'Navbar'
}

const Template = () => {
    const history = createBrowserHistory();
    return (
        <Router history={history}><Nav /></Router>
    )
}

export const Navbar = Template.bind({})