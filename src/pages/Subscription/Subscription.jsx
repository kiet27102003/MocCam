import React, { useState, useEffect } from "react";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaCheck, FaStar, FaGem, FaRocket, FaSpinner } from "react-icons/fa";
import { message } from 'antd';
import Footer from "../../components/Footer/Footer";
import { subscriptionService } from "../../services/subscriptionService";

const Subscription = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch subscription plans from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        if (!token) {
          console.log('No token found, user not authenticated');
          setError('Bạn cần đăng nhập để xem danh sách gói đăng ký');
          setLoading(false);
          return;
        }
        
        const data = await subscriptionService.getAllPlans();
        
        // Transform API data to match our component structure
        const transformedPackages = data.map((plan, index) => ({
          id: plan.id || plan.plan_id,
          name: plan.name || plan.plan_name,
          icon: getIconByIndex(index),
          price: plan.price || plan.current_price,
          originalPrice: plan.original_price || plan.price,
          duration: plan.duration || plan.duration_type || "tháng",
          features: plan.features || plan.description ? plan.description.split('\n').filter(f => f.trim()) : [],
          popular: plan.popular || index === 1, // Default second item as popular
          color: getColorByIndex(index)
        }));
        
        setPackages(transformedPackages);
      } catch (err) {
        console.error('Error fetching packages:', err);
        
        // Handle specific error cases
        if (err.message.includes('401')) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          message.error('Phiên đăng nhập đã hết hạn');
          // Optionally redirect to login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (err.message.includes('403')) {
          setError('Bạn không có quyền truy cập danh sách gói đăng ký.');
          message.error('Không có quyền truy cập');
        } else if (err.message.includes('500')) {
          setError('Lỗi máy chủ. Vui lòng thử lại sau.');
          message.error('Lỗi máy chủ');
        } else {
          setError('Không thể tải danh sách gói đăng ký. Vui lòng thử lại sau.');
          message.error('Không thể tải danh sách gói đăng ký');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [navigate]);

  // Helper function to get icon by index
  const getIconByIndex = (index) => {
    const icons = [<FaStar />, <FaCrown />, <FaGem />];
    return icons[index] || <FaStar />;
  };

  // Helper function to get color by index
  const getColorByIndex = (index) => {
    const colors = ["#10b981", "#f59e0b", "#8b5cf6"];
    return colors[index] || "#10b981";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleSubscribe = async (packageData, voucherId = null) => {
    if (!user) {
      message.warning("Bạn cần đăng nhập để mua gói này!");
      navigate("/login");
      return;
    }
    const { icon: _icon, ...safePackageData } = packageData;
    // Navigate to order confirmation page with package data
    navigate("/order-confirmation", {
      state: {
        package: safePackageData,
        voucherId: voucherId
      }
    });
  };

  // Loading component
  if (loading) {
    return (
      <div className="subscription-container">
        <div className="subscription-header">
          <button 
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Quay lại trang chủ
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

        <div className="loading-container">
          <div className="loading-spinner">
            <FaSpinner className="spinning" />
          </div>
          <p>Đang tải danh sách gói đăng ký...</p>
        </div>

        <Footer />
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="subscription-container">
        <div className="subscription-header">
          <button 
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Quay lại trang chủ
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

        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <button 
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Quay lại trang chủ
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

      <div className="packages-container">
        {packages.length > 0 ? (
          packages.map((pkg) => (
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
          ))
        ) : (
          <div className="no-packages">
            <h3>Không có gói đăng ký nào</h3>
            <p>Hiện tại chưa có gói đăng ký nào được cung cấp.</p>
          </div>
        )}
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
