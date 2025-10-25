import React from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import "./BangXepHang.css";

export default function BangXepHangPlaceholder() {
  return (
    <div className="bxh-layout">
      <div className="dashboard-container">
        <Sidebar active="bangxephang" />
        <div className="content-area">
          <Navbar />
          <div className="main-content">
            <h1>Bảng xếp hạng</h1>
            <p>Chức năng bảng xếp hạng đang được phát triển...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
