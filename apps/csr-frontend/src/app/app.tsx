import React from "react";
import Layout from "./Layout";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../util/constants";
import { GuardedRoute } from "../features";

// TODO: make a suspense fallback so these can be lazy loaded.
import Home from "../pages/home/Home";
import ContactUs from "../pages/contact-us/ContactUs";
import CreateAccount from '../pages/create-account/CreateAccount';
import ChooseName from "../pages/choose-name/ChooseName";
// import Login from "../pages/login/Login";
// import Register from "../pages/register/Register";

const App: React.FC = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path='/contact-us' component={ContactUs} />
        <Route exact path='/create-account' component={CreateAccount} />
        <Route path='/game/choose-name/' component={ChooseName} />
      </Switch>
    </Layout>
  );
};

export default App;
