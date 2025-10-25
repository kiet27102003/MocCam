import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Add error handler for CORS issues
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Cross-Origin-Opener-Policy')) {
    console.warn('COOP Policy Warning - This is expected for Google OAuth:', event.message);
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider 
      clientId="988717893177-eb8sch83kopsql7054nvo766ajbdrs6t.apps.googleusercontent.com"
      useOneTap={false}
      auto_select={false}
    >
      <App />
    </GoogleOAuthProvider>
);
