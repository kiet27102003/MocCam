import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import "./PaymentCancel.css";

const PaymentCancel = () => {
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
    <div className="payment-cancel-container">
      <div className="cancel-card">
        <div className="cancel-icon">
          <FaTimesCircle />
        </div>
        
        <h1 className="cancel-title">Thanh toán đã bị hủy</h1>
        
        <p className="cancel-message">
          Bạn đã hủy quá trình thanh toán. 
          Bạn có thể thử lại bất kỳ lúc nào.
        </p>

        <div className="cancel-details">
          <div className="detail-item">
            <span className="label">Trạng thái:</span>
            <span className="value cancel">Đã hủy</span>
          </div>
          
          {searchParams.get('orderCode') && (
            <div className="detail-item">
              <span className="label">Mã đơn hàng:</span>
              <span className="value">{searchParams.get('orderCode')}</span>
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

export default PaymentCancel;
