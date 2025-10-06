import React from "react";
import "./DanTranh.css";
import { FaBook, FaMusic, FaTrophy, FaUser, FaSlidersH } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";

export default function DanTranh() {
//   const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="dantranh-page">
      <Navbar />
      {/* <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
        </div>

        <div className="navbar-center">
          <div className="navbar-title">
            <span className="instrument-name">Đàn Tranh</span>
            <span className="divider">|</span>
            <span className="lesson-title">Nốt nhạc và kỹ thuật đặt tay cơ bản</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-fire">
            <span className="fire-icon">🔥</span>
            <span className="fire-count">10</span>
          </div>
          <img src="/images/avatar.png" alt="Avatar" className="avatar-img" />
        </div>
      </nav> */}

      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li className="active">
            <FaBook className="icon" />
            <span>Học đàn</span>
          </li>
          <li>
            <FaMusic className="icon" />
            <span>Bài hát</span>
          </li>
          <li>
            <FaTrophy className="icon" />
            <span>Bảng xếp hạng</span>
          </li>
          <li>
            <FaUser className="icon" />
            <span>Hồ sơ</span>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="notes">
          <div className="note large"></div>
          <div className="note medium"></div>
          <div className="note short"></div>
          <div className="note medium"></div>
        </div>
      </main>
      
    </div>
  );
}
