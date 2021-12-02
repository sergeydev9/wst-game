import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Modal from 'react-modal';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// local imports
import App from './app/app';
import { store } from './app/store';
import ScrollToTop from './util/scrollToTop';

import './styles.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/roboto/500.css';

const stripeKey = process.env.NX_STRIPE_KEY as string;
const stripePromise = loadStripe(stripeKey);

Modal.setAppElement('#root');
Modal.defaultStyles = {};

// TODO: Add a root SEO component with React Helmet
ReactDOM.render(
  <StrictMode>
    <Router>
      <ScrollToTop>
        <Provider store={store}>
          <PayPalScriptProvider options={{
            "client-id": process.env.NX_PAYPAL_CLIENT_ID as string,
            currency: "USD",
            components: 'buttons',
            intent: 'capture',
            'disable-funding': 'credit'
          }}>
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </ PayPalScriptProvider>
        </Provider>
      </ScrollToTop>
    </Router>
  </StrictMode>,
  document.getElementById('root')
);
