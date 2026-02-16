import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< Updated upstream
import App from "./App";
=======
import { Provider } from "react-redux";

import AppRoutes from "./AppRoutes";
import { store } from "./store";
>>>>>>> Stashed changes

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>
);
