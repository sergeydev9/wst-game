import { Route, Switch, BrowserRouter } from "react-router-dom";
import loadable from '@loadable/component'

import { GuardedRoute } from "../features";
import { SocketProvider } from "./socketContext";
import Layout from "./Layout";
import Home from '../pages/home/Home';

const ContactUs = loadable(() => import('../pages/contact-us/ContactUs'))
const ChooseName = loadable(() => import('../features/choose-name/ChooseName'));
const CreateAccount = loadable(() => import('../pages/create-account/CreateAccount'))
const Login = loadable(() => import('../pages/login/Login'))
const Decks = loadable(() => import('../pages/decks/Decks'))
const MyAccount = loadable(() => import('../pages/my-account/MyAccount'))
const SendResetForm = loadable(() => import('../features/reset-password/SendResetForm'))
const EnterCode = loadable(() => import('../features/reset-password/EnterCode'))
const NewPassword = loadable(() => import('../features/reset-password/NewPassword'));
const Invite = loadable(() => import('../pages/invite/Invite'));
const PurchaseSuccess = loadable(() => import('../pages/purchase-success/PurchaseSuccess'));
const Play = loadable(() => import('../pages/play/Play'));


const App: React.FC = () => {

  return (

    <BrowserRouter>
      <SocketProvider>
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
            <Route path='/play'>
              <Play />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/decks'>
              <Decks />
            </Route>
            <GuardedRoute path='/account' exact >
              <MyAccount />
            </GuardedRoute>
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
      </SocketProvider>
    </BrowserRouter>

  );
};

export default App;
