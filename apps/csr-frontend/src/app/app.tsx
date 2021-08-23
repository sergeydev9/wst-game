import Layout from "./Layout";
import { Route, Switch, BrowserRouter } from "react-router-dom";

// TODO: make a suspense fallback so these can be lazy loaded.
import Home from "../pages/home/Home";
import ContactUs from "../pages/contact-us/ContactUs";
import CreateAccount from '../pages/create-account/CreateAccount';
import ChooseName from "../pages/choose-name/ChooseName";
import Login from '../pages/login/Login';
// import Login from "../pages/login/Login";

const App: React.FC = () => {
  return (

    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path='/contact-us' >
            <ContactUs />
          </Route>
          <Route exact path='/create-account' >
            <CreateAccount />
          </Route>
          <Route path='/choose-name'>
            <ChooseName />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
        </Switch>
      </Layout>
    </BrowserRouter>

  );
};

export default App;
