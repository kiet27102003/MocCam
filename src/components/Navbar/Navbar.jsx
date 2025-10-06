import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../Setting/Setting";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        <img src="/logo1.png" alt="Mộc Cầm" />
      </div>

      <div
        className="navbar-avatar"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <img src="/vite.svg" alt="User Avatar" className="avatar-img" />


        {showMenu && (
          <ul className="dropdown-menu">
            <li>Thông tin cá nhân</li>
            <li>Lịch sử</li>
            <li>Thanh toán</li>
            <li onClick={() => setIsSettingsModalOpen(true)}>Cài đặt</li>
            <li onClick={handleLogout} className="logout">Đăng xuất</li>
          </ul>
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
