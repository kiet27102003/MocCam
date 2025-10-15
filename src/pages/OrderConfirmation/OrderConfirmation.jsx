import React, { useState, useEffect } from "react";
import "./OrderConfirmation.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaGift, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import axios from "axios";
import Footer from "../../components/Footer/Footer";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // Check authentication and get package data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Get package data from location state
    if (location.state?.package) {
      setSelectedPackage(location.state.package);
      setFinalPrice(location.state.package.price);
    } else {
      // Fallback: redirect back to subscription if no package data
      navigate("/subscription");
    }
  }, [navigate, location.state]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleVoucherApply = async () => {
    if (!voucherCode.trim()) {
      setError("Vui lòng nhập mã voucher!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call API to validate voucher
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/vouchers/validate",
        {
          voucher_code: voucherCode,
          plan_id: selectedPackage.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.valid) {
        setVoucherApplied(true);
        setVoucherDiscount(response.data.discount_amount || 0);
        setFinalPrice(selectedPackage.price - (response.data.discount_amount || 0));
        setError("");
      } else {
        setError(response.data.message || "Mã voucher không hợp lệ!");
      }
    } catch (err) {
      console.error("Error validating voucher:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể kiểm tra mã voucher. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherRemove = () => {
    setVoucherCode("");
    setVoucherApplied(false);
    setVoucherDiscount(0);
    setFinalPrice(selectedPackage.price);
    setError("");
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // Prepare request body
      const requestBody = {
        plan_id: selectedPackage.id
      };
      
      // Add voucher_id if applied
      if (voucherApplied && voucherCode) {
        requestBody.voucher_id = voucherCode;
      }
      
      const response = await axios.post(
        "http://localhost:3000/api/payments/payos/create",
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Payment link created:", response.data);

      if (response.data.checkoutUrl) {
        // Redirect to PayOS payment page
        window.location.href = response.data.checkoutUrl;
      } else {
        setError("Không thể tạo link thanh toán. Vui lòng thử lại!");
      }

    } catch (err) {
      console.error("Error creating payment:", err);
      
      if (err.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || !selectedPackage) {
    return (
      <div className="order-confirmation-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <div className="order-header">
        <button 
          className="back-button"
          onClick={() => navigate("/subscription")}
          disabled={loading}
        >
          <FaArrowLeft /> Quay lại
        </button>
        
        <div className="header-content">
          <h1 className="order-title">Xác nhận đơn hàng</h1>
          <p className="order-subtitle">Kiểm tra lại thông tin và áp dụng mã giảm giá</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="order-content">
        <div className="order-summary">
          <div className="summary-card">
            <h3>Thông tin gói đăng ký</h3>
            
            <div className="package-info">
              <div className="package-icon" style={{ color: selectedPackage.color }}>
                {selectedPackage.icon}
              </div>
              <div className="package-details">
                <h4>{selectedPackage.name}</h4>
                <p>Gói đăng ký {selectedPackage.duration}</p>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-item">
                <span>Giá gốc:</span>
                <span>{formatPrice(selectedPackage.price)}</span>
              </div>
              
              {voucherApplied && (
                <div className="price-item discount">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              
              <div className="price-item total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="voucher-section">
          <div className="voucher-card">
            <h3>
              <FaGift /> Mã giảm giá
            </h3>
            
            {!voucherApplied ? (
              <div className="voucher-input-group">
                <input
                  type="text"
                  placeholder="Nhập mã voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="apply-voucher-btn"
                  onClick={handleVoucherApply}
                  disabled={loading || !voucherCode.trim()}
                >
                  {loading ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>
            ) : (
              <div className="voucher-applied">
                <div className="applied-voucher">
                  <FaCheck className="check-icon" />
                  <span>Mã "{voucherCode}" đã được áp dụng</span>
                </div>
                <button
                  className="remove-voucher-btn"
                  onClick={handleVoucherRemove}
                  disabled={loading}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="payment-section">
          <div className="payment-card">
            <h3>
              <FaCreditCard /> Thông tin thanh toán
            </h3>
            
            <div className="payment-methods">
              <div className="payment-method">
                <div className="method-icon">💳</div>
                <div className="method-info">
                  <h4>Thanh toán qua PayOS</h4>
                  <p>Hỗ trợ thẻ ATM, Visa, Mastercard, MoMo, ZaloPay</p>
                </div>
              </div>
            </div>

            <div className="security-info">
              <FaShieldAlt className="security-icon" />
              <span>Giao dịch được bảo mật 100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-footer">
        <div className="footer-content">
          <div className="total-amount">
            <span>Tổng thanh toán:</span>
            <span className="amount">{formatPrice(finalPrice)}</span>
          </div>
          
          <button
            className="proceed-payment-btn"
            onClick={handleProceedToPayment}
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner">Đang xử lý...</div>
            ) : (
              <>
                <FaCreditCard />
                Thanh toán ngay
              </>
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
