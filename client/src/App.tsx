/* eslint-disable */
import React from "react";

import { Provider } from "react-redux";

// component
import AppRoutes from "./AppRoutes";
import ToasterComponent from "./Components/UI/toaster";

// redux
import store from "./Store/store";

// helper

// css
import "react-toastify/dist/ReactToastify.css";
import "./Assets/Css/style.css";
import "./Assets/Css/custom-new-style.css";

function App() {
  if (window !== window.top) {
    if (window.top) window.top.location = window.location;
  }

  return (
    <div>
      <Provider store={store}>
        <AppRoutes />
        <ToasterComponent />
      </Provider>
    </div>
  );
}

export default App;
