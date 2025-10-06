import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InstrumentSelect from "./pages/InstrumentSelect/InstrumentSelect";
import DanTranh from "./pages/DanTranh/DanTranh";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/instrument-select" element={<InstrumentSelect />} />
        <Route path="/dan-tranh" element={<DanTranh />} />
      </Routes>
    </Router>
  );
}

export default App;
