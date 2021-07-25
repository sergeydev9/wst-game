
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

// local imports
import App from "./app/app";
import { history } from "./app/hooks";
import { store } from "./app/store";
import "./styles.css";

// TODO: Add a root SEO component with React Helmet
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);


