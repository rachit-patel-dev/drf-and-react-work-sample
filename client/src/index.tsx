import React from "react";
import ReactDOM from "react-dom";

import "./Config";

// Component
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// css
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
