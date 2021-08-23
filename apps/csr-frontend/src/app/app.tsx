import React from "react";
import Layout from "./Layout";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../util/constants";
import { GuardedRoute } from "../features";

// TODO: make a suspense fallback so these can be lazy loaded.
import Home from "../pages/home/Home";
import ContactUs from "../pages/contact-us/ContactUs";
// import Login from "../pages/login/Login";
// import Register from "../pages/register/Register";

const App: React.FC = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path={ROUTES.contactUs} component={ContactUs} />
      </Switch>
    </Layout>
  );
};

export default App;
