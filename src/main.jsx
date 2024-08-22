import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Context/UserContext.jsx";
import { NotificationsProvider } from "./Context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </UserProvider>
  </BrowserRouter>
);
