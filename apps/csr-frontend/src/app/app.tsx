import { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';
import loadable from '@loadable/component'

import { GuardedRoute, SocketProvider } from "../features";
import Layout from "./Layout";
import Faq from '../pages/faq/Faq';
import Home from '../pages/home/Home';
import Thanks from '../pages/thanks/Thanks';

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
const PrivacyPolicy = loadable(() => import('../pages/privacy-policy/PrivacyPolicy'));
const TermsAndConditions = loadable(() => import('../pages/terms-and-conditions/TermsAndConditions'));


const App: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    let unlisten;

    if (process.env.NODE_ENV === 'production') {
      const trackingId = process.env.NX_GA_TRACKING_ID;

      if (typeof trackingId === 'string' && trackingId !== 'false') {
        ReactGA.initialize(trackingId);
        ReactGA.pageview(window.location.pathname + window.location.search);
        unlisten = history.listen((location: any) => {
          ReactGA.pageview(location.pathname + location.search);
        });
      }
    }

    return unlisten;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketProvider>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/faq">
            <Faq />
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
          <Route exact path="/privacy-policy">
            <PrivacyPolicy />
          </Route>
          <Route exact path="/thanks">
            <Thanks />
          </Route>
          <Route exact path="/terms-and-conditions">
            <TermsAndConditions />
          </Route>
          <Route path="*" >
            <Home />
          </Route>
        </Switch>
      </Layout>
    </SocketProvider>
  );
};

export default App;
