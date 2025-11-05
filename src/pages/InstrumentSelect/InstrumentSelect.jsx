import React from "react";
import "./InstrumentSelect.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const instruments = [
  { 
    name: "Đàn Nguyệt", 
    image: "/nguyệt.png", 
    route: "/home?instrument=nguyet",
    description: "Nhạc cụ dây truyền thống",
    status: "coming_soon",
    features: ["Âm thanh mộc mạc", "Kỹ thuật cao", "Lịch sử lâu đời"]
  },
  { 
    name: "Đàn Tranh", 
    image: "/tranh.png", 
    route: "/demo5.html",
    description: "Đàn tranh 16 dây cổ điển",
    status: "available",
    features: ["16 dây chuẩn", "Bài học chi tiết", "Thực hành ngay"]
  },
  { 
    name: "Đàn Tỳ Bà", 
    image: "/tỳ_bà.png", 
    route: "/home?instrument=tyba",
    description: "Đàn tỳ bà 4 dây",
    status: "coming_soon",
    features: ["Âm thanh trong trẻo", "Kỹ thuật độc đáo", "Phong cách riêng"]
  },
];

const InstrumentSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (instrument) => {
    if (instrument.status === "coming_soon") {
      toast.info(`${instrument.name} - Sắp ra mắt! 🎵`, {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        style: {
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white"
        }
      });
    } else if (instrument.status === "available") {
      // Navigate to course selection page
      navigate("/courses");
    } else {
      navigate(instrument.route);
    }
  };


  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Sẵn sàng học";
      case "coming_soon":
        return "Sắp ra mắt";
      default:
        return "";
    }
  };

  return (
    <div className="instrument-select-page">
      <Header />

      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">
            Chọn nhạc cụ để bắt đầu học<br />
            <span className="page-subtitle">Khám phá vẻ đẹp của âm nhạc truyền thống Việt Nam</span>
          </h1>
        </div>

        <div className="instruments-grid">
          {instruments.map((instrument) => (
            <div
              key={instrument.name}
              className={`instrument-card ${instrument.status}`}
              onClick={() => handleSelect(instrument)}
            >
              <div className="card-header">
                <span className="status-text">{getStatusText(instrument.status)}</span>
              </div>

              <div className="instrument-image-container">
                <img 
                  src={instrument.image} 
                  alt={instrument.name} 
                  className="instrument-img" 
                />
                <div className="image-overlay">
                  <FaStar className="overlay-icon" />
                </div>
              </div>

              <div className="card-content">
                <h3 className="instrument-name">{instrument.name}</h3>
                <p className="instrument-description">{instrument.description}</p>
                
                <div className="features-list">
                  {instrument.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-dot"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-footer">
                <button className="select-button">
                  {instrument.status === "available" ? "Bắt đầu học" : "Thông báo khi ra mắt"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="page-footer">
          <div className="info-card">
            <h3>Về Mộc Cầm</h3>
            <p>
              Nền tảng học nhạc cụ truyền thống Việt Nam hàng đầu, 
              mang đến trải nghiệm học tập chất lượng cao với các giảng viên chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default InstrumentSelect;
