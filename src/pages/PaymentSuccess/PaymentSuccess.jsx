import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Auto redirect to subscription page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/subscription");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToSubscription = () => {
    navigate("/subscription");
  };

  return (
    <div className="payment-success-container">
      <div className="success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <h1 className="success-title">Thanh toán thành công!</h1>
        
        <p className="success-message">
          Cảm ơn bạn đã đăng ký gói học tại Mộc Cầm. 
          Bạn có thể bắt đầu học ngay bây giờ.
        </p>

        <div className="success-details">
          <div className="detail-item">
            <span className="label">Trạng thái:</span>
            <span className="value success">Thành công</span>
          </div>
          
          {searchParams.get('orderCode') && (
            <div className="detail-item">
              <span className="label">Mã đơn hàng:</span>
              <span className="value">{searchParams.get('orderCode')}</span>
            </div>
          )}
          
          {searchParams.get('amount') && (
            <div className="detail-item">
              <span className="label">Số tiền:</span>
              <span className="value">{searchParams.get('amount')} VND</span>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={handleBackToSubscription}
          >
            <FaArrowLeft />
            Quay lại trang đăng ký
          </button>
        </div>

        <div className="auto-redirect">
          <p>Tự động chuyển về trang đăng ký sau <span className="countdown">5</span> giây...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
