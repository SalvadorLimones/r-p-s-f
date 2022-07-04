import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { VisibleProvider } from "./providers/visible";
import { AuthProvider } from "./providers/auth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <VisibleProvider>
      <Router>
        <App />
      </Router>
    </VisibleProvider>
  </AuthProvider>
);
