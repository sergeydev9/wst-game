import Layout from "./Layout";
import { Route, Switch, BrowserRouter } from "react-router-dom";

// TODO: make a suspense fallback so these can be lazy loaded.
import Home from "../pages/home/Home";
import ContactUs from "../pages/contact-us/ContactUs";
import CreateAccount from '../pages/create-account/CreateAccount';
import ChooseName from "../features/choose-name/ChooseName";
import Login from '../pages/login/Login';
import Decks from '../pages/decks/Decks';
import MyAccount from '../pages/my-account/MyAccount';
import { GuardedRoute } from "../features";
import SendResetForm from "../features/reset-password/SendResetForm";
import EnterCode from "../features/reset-password/EnterCode";
import NewPassword from "../features/reset-password/NewPassword";
import Invite from "../pages/invite/Invite";
import PurchaseSuccess from "../pages/purchase-success/PurchaseSuccess";

const App: React.FC = () => {
  return (

    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/game/invite">
            <Invite />
          </Route>
          <Route exact path='/contact-us' >
            <ContactUs />
          </Route>
          <Route exact path='/create-account' >
            <CreateAccount />
          </Route>
          <Route path='/x/:access_code'>
            <ChooseName />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/decks'>
            <Decks />
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
          <Route exact path="/purchase-success">
            <PurchaseSuccess />
          </Route>
          <Route path="*" >
            <Home />
          </Route>
        </Switch>
      </Layout>
    </BrowserRouter>

  );
};

export default App;
