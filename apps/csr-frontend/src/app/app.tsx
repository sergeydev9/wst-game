import Layout from "./Layout";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

// TODO: make a suspense fallback so these can be lazy loaded.
import Home from "../pages/home/Home";
import ContactUs from "../pages/contact-us/ContactUs";
import CreateAccount from '../pages/create-account/CreateAccount';
import ChooseName from "../features/choose-name/ChooseName";
import Login from '../pages/login/Login';
import DeckSelection from '../features/decks/DeckSelection';
import MyAccount from '../pages/my-account/MyAccount';
import { GuardedRoute } from "../features";
import SendResetForm from "../features/reset-password/SendResetForm";
import EnterCode from "../features/reset-password/EnterCode";
import NewPassword from "../features/reset-password/NewPassword";

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
          <Route path='/join'>
            <ChooseName />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/decks'>
            <DeckSelection />
          </Route>
          <GuardedRoute component={MyAccount} path='/account' exact />
          <Route exact path='/reset/send-email'>
            <SendResetForm />
          </Route>
          <Route exact path="/reset/enter-code">
            <EnterCode />
          </Route>
          <Route exact path="/reset/new-pass">
            <NewPassword />
          </Route>
          <Redirect to='/' path="*" />
        </Switch>
      </Layout>
    </BrowserRouter>

  );
};

export default App;
