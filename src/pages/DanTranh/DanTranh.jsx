import React, { useEffect, useState } from "react";
import "./DanTranh.css";
import { FaBook, FaMusic, FaTrophy, FaUser, FaSlidersH } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function DanTranh() {
  const [showModal, setShowModal] = useState(false);

  // Tự bật modal khi trang load
  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <div className={`dantranh-page ${showModal ? "blurred" : ""}`}>
      <Navbar />

      {/* Sidebar */}
      <Sidebar
        active="hocdan"
        onSelect={(key) => console.log("Chọn menu:", key)}
      />

      {/* Main content */}
      <main className="main-content">
        <div className="notes">
          <div className="note large"></div>
          <div className="note medium"></div>
          <div className="note short"></div>
          <div className="note medium"></div>
        </div>
      </main>

      {/* Modal giới thiệu đàn tranh */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div className="modal-content">
              <div className="modal-section">
                <div className="image-placeholder">Ảnh</div>
                <div className="text-content">
                  <h3>TỔNG QUAN</h3>
                  <p>
                  Đàn tranh là nhạc cụ truyền thống đặc trưng của Việt Nam, có nguồn gốc từ Trung Quốc và du nhập vào Việt Nam 
                  từ khoảng thế kỷ XIII. Ban đầu có 15 dây, sau phát triển thành 16 dây và hiện nay có thể lên đến 25 dây để mở rộng âm vực.
                  </p>
                  <h3>CẤU TẠO</h3>
                  <p>
                  Đàn tranh có hình hộp dài, mặt đàn vồng, và được làm từ các loại gỗ quý. Các bộ phận chính gồm hộp đàn, mặt đàn,
                  thành đàn, đáy đàn, cầu đàn (ngựa đàn), dây đàn và trục đàn.
                  </p>
                </div>
              </div>

              <div className="modal-section">
                <div className="image-placeholder">Ảnh</div>
                <div className="text-content">
                  <h3>MỘT SỐ KỸ THUẬT</h3>
                  <p>
                  Người chơi sử dụng móng gảy ở tay phải để tạo âm thanh, kết hợp với tay trái để nhấn luyến, rung, vỗ, tạo nên những âm điệu mượt mà, truyền cảm.
                  Kỹ thuật chơi đàn tranh đòi hỏi sự tinh tế và khéo léo của cả hai tay.
                  </p>
                  <h3>VAI TRÒ TRONG ÂM NHẠC VIỆT NAM</h3>
                  <p>
                  Với âm sắc trong trẻo, đàn tranh đóng vai trò quan trọng trong âm nhạc truyền thống Việt Nam, từ độc tấu, 
                  hòa tấu trong các dàn nhạc dân tộc (như tài tử, nhã nhạc cung đình) đến đệm cho dân ca, cải lương, hát chầu văn. 
                  Không chỉ là nhạc cụ, đàn tranh còn là biểu tượng văn hóa, góp phần làm giàu nền âm nhạc dân tộc và tiếp tục được bảo tồn,
                  phát triển trong cả các sáng tác hiện đại.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
