import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InstrumentSelect from "./pages/InstrumentSelect/InstrumentSelect";
import DanTranh from "./pages/DanTranh/DanTranh";
import SongList from "./pages/DanTranh/ListTranh/SongList";
import BangXepHang from "./pages/DanTranh/Ranking/BangXepHang";
import HoSo from "./pages/DanTranh/Profile/HoSo";
import Subscription from "./pages/Subscription/Subscription";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<InstrumentSelect />} />
        <Route path="/dan-tranh" element={<DanTranh />} />
        <Route path="/song-list" element={<SongList />} />
        <Route path="/bangxephang" element={<BangXepHang />} />
        <Route path="/HoSo" element={<HoSo />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
