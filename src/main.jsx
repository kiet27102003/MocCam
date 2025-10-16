import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="988717893177-eb8sch83kopsql7054nvo766ajbdrs6t.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
);
