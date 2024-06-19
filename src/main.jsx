import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RotaProvider } from "./RotaContext.jsx";
import { UserProvider } from "./UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <RotaProvider>
        <App />
      </RotaProvider>
    </UserProvider>
  </BrowserRouter>
);
