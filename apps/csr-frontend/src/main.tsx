
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Modal from 'react-modal';

// local imports
import App from "./app/app";
import { store } from "./app/store";
import "./styles.css";
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/roboto/500.css';

Modal.setAppElement('#root');

// TODO: Add a root SEO component with React Helmet
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);


