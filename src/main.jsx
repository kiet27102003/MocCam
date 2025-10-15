import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="414632897887-und4ahhg6rqth01ng31khlp4hu506r9e.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
);
