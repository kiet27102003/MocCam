import React, { useState, useEffect } from "react";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaCheck, FaStar, FaGem, FaRocket } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

const Subscription = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Subscription packages data
  const packages = [
    {
      id: 1, // plan_id for backend
      name: "Gói Cơ Bản",
      icon: <FaStar />,
      price: 9000,
      originalPrice: 149000,
      duration: "tháng",
      features: [
        "Truy cập 50+ bài hát premium",
        "Học đàn không giới hạn",
        "Bỏ quảng cáo hoàn toàn",
        "Hỗ trợ kỹ thuật 24/7"
      ],
      popular: false,
      color: "#10b981"
    },
    {
      id: 2, // plan_id for backend
      name: "Gói Premium",
      icon: <FaCrown />,
      price: 199000,
      originalPrice: 299000,
      duration: "tháng",
      features: [
        "Tất cả tính năng gói Cơ Bản",
        "Truy cập 200+ bài hát premium",
        "Video hướng dẫn chi tiết",
        "Tải nhạc offline",
        "Chế độ luyện tập nâng cao",
        "Phân tích tiến độ học tập"
      ],
      popular: true,
      color: "#f59e0b"
    },
    {
      id: 3, // plan_id for backend
      name: "Gói VIP",
      icon: <FaGem />,
      price: 399000,
      originalPrice: 599000,
      duration: "tháng",
      features: [
        "Tất cả tính năng gói Premium",
        "Truy cập không giới hạn toàn bộ thư viện",
        "Học 1-1 với chuyên gia",
        "Bài học cá nhân hóa",
        "Ưu tiên hỗ trợ",
        "Quà tặng độc quyền",
        "Sự kiện offline miễn phí"
      ],
      popular: false,
      color: "#8b5cf6"
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleSubscribe = async (packageData, voucherId = null) => {
    if (!user) {
      setError("Vui lòng đăng nhập để mua gói!");
      return;
    }
    const { icon, ...safePackageData } = packageData;
    // Navigate to order confirmation page with package data
    navigate("/order-confirmation", {
      state: {
        package: safePackageData,
        voucherId: voucherId
      }
    });
  };

  if (!user) {
    return (
      <div className="subscription-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <button 
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Quay lại
        </button>
        
        <div className="header-content">
          <h1 className="subscription-title">
            Nâng cấp trải nghiệm học đàn của bạn
          </h1>
          <p className="subscription-subtitle">
            Chọn gói phù hợp để khám phá thế giới âm nhạc không giới hạn
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="packages-container">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`package-card ${pkg.popular ? 'popular' : ''}`}
          >
            {pkg.popular && (
              <div className="popular-badge">
                <FaRocket /> Phổ biến nhất
              </div>
            )}
            
            <div className="package-header">
              <div className="package-icon" style={{ color: pkg.color }}>
                {pkg.icon}
              </div>
              <h3 className="package-name">{pkg.name}</h3>
            </div>

            <div className="package-pricing">
              <div className="price-container">
                <span className="current-price">{formatPrice(pkg.price)}</span>
                <span className="duration">/{pkg.duration}</span>
              </div>
              <div className="original-price">{formatPrice(pkg.originalPrice)}</div>
              <div className="discount">
                Tiết kiệm {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
              </div>
            </div>

            <ul className="package-features">
              {pkg.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`subscribe-button ${pkg.popular ? 'popular' : ''}`}
              onClick={() => handleSubscribe(pkg)}
              style={{ backgroundColor: pkg.color }}
            >
              Chọn gói {pkg.name}
            </button>
          </div>
        ))}
      </div>

      <div className="subscription-footer">
        <div className="footer-content">
          <h3>Tại sao chọn Mộc Cầm Premium?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🎵</div>
              <div className="benefit-text">
                <h4>Thư viện nhạc phong phú</h4>
                <p>Hàng trăm bài hát từ cổ điển đến hiện đại</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">👨‍🏫</div>
              <div className="benefit-text">
                <h4>Giảng viên chuyên nghiệp</h4>
                <p>Học từ những nghệ sĩ tài năng nhất</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <div className="benefit-text">
                <h4>Học mọi lúc mọi nơi</h4>
                <p>Truy cập trên mọi thiết bị, mọi thời điểm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Subscription;
