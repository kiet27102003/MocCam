import React from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import "./HoSo.css";

export default function HoSoPlaceholder() {
  return (
    <div className="hoso-layout">
      <div className="dashboard-container">
        <Sidebar active="hoso" />
        <div className="content-area">
          <Navbar />
          <div className="main-content">
            <h1>Hồ sơ cá nhân</h1>
            <p>Chức năng hồ sơ cá nhân đang được phát triển...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
