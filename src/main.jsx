import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// Import Tailwind CSS
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./pages/layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import store from "../src/redux/store.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import * as serviceWorker from "./serviceWorker.js";
import { subscribeUser } from "./subscription.js";
import "./i18n.js"
// import './@fake-db'

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer closeOnClick draggable pauseOnFocusLoss hideProgressBar />
    <BrowserRouter>
      <Layout appComponent={<App />} />
    </BrowserRouter>
  </Provider>
);

serviceWorker.register();
subscribeUser();
