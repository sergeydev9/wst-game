
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Modal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// local imports
import App from "./app/app";
import { store } from "./app/store";
import "./styles.css";
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/roboto/500.css';

const stripePromise = loadStripe(process.env.NX_STRIPE_KEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh');


Modal.setAppElement('#root');
Modal.defaultStyles = {};

// TODO: Add a root SEO component with React Helmet
ReactDOM.render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <Provider store={store}>
        <App />
      </Provider>
    </Elements>
  </StrictMode>,
  document.getElementById("root")
);


