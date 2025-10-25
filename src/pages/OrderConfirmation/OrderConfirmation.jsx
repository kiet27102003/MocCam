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
  const [voucherId, setVoucherId] = useState(null);
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
    console.log("🔍 Starting voucher apply process...");
    console.log("Voucher code:", voucherCode);
    console.log("Selected package:", selectedPackage);
    
    if (!voucherCode.trim()) {
      setError("Vui lòng nhập mã voucher!");
      return;
    }

    if (!selectedPackage) {
      setError("Không tìm thấy thông tin gói đăng ký!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token available:", !!token);
      
      console.log("📤 Making GET request to:", `/api/vouchers/check/${voucherCode}`);
      
      const response = await axios.get(
        `/api/vouchers/check/${voucherCode}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("✅ Voucher validation response:", response.data);
      const data = response.data;

      // Check multiple possible response formats
      const isValid = data.valid === true || 
                     data.isValid === true || 
                     data.status === 'valid' ||
                     (data.discount_amount && data.discount_amount > 0) ||
                     (data.discount && data.discount > 0) ||
                     (data.discount_value && data.discount_value > 0);

      console.log("🔍 Voucher validation check:");
      console.log("- data.valid:", data.valid);
      console.log("- data.isValid:", data.isValid);
      console.log("- data.status:", data.status);
      console.log("- data.discount_amount:", data.discount_amount);
      console.log("- data.discount:", data.discount);
      console.log("- data.discount_value:", data.discount_value);
      console.log("- Final isValid result:", isValid);

      if (isValid) {
        const discountAmount = data.discount_amount || data.discount || data.discount_value || 0;
        const newFinalPrice = Math.max(0, selectedPackage.price - discountAmount);
        const voucherIdValue = data.voucher_id || data.id;
        
        console.log("💰 Applying discount:");
        console.log("- Original price:", selectedPackage.price);
        console.log("- Discount amount:", discountAmount);
        console.log("- Final price:", newFinalPrice);
        console.log("- Voucher ID:", voucherIdValue);
        
        setVoucherApplied(true);
        setVoucherDiscount(discountAmount);
        setVoucherId(voucherIdValue);
        setFinalPrice(newFinalPrice);
        setError("");
        
        console.log("✅ Voucher applied successfully!");
      } else {
        const errorMsg = data.message || data.error || "Mã voucher không hợp lệ!";
        console.log("❌ Voucher invalid:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("💥 Error checking voucher:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });

      if (err.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể kiểm tra mã voucher. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
      console.log("🏁 Voucher apply process finished");
    }
  };

  const handleVoucherRemove = () => {
    setVoucherCode("");
    setVoucherApplied(false);
    setVoucherDiscount(0);
    setVoucherId(null);
    setFinalPrice(selectedPackage.price);
    setError("");
  };

  const handleProceedToPayment = async () => {
    console.log("💳 Starting payment process...");
    console.log("📦 Selected package:", selectedPackage);
    console.log("🎫 Voucher applied:", voucherApplied);
    console.log("🎫 Voucher code:", voucherCode);
    console.log("🎫 Voucher ID:", voucherId, "Type:", typeof voucherId);
    console.log("💰 Final price:", finalPrice);
    
    // Validate voucher data
    if (voucherApplied && (!voucherId || voucherId === null || voucherId === undefined)) {
      console.error("❌ Voucher applied but voucherId is missing!");
      setError("Lỗi: Mã voucher không hợp lệ. Vui lòng thử lại!");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token available:", !!token);
      
      // Prepare request body
      const requestBody = {
        plan_id: parseInt(selectedPackage.id) // Ensure plan_id is a number
      };
      
      // Add voucher_id if applied
      if (voucherApplied && voucherId) {
        requestBody.voucher_id = parseInt(voucherId); // Ensure it's a number
        console.log("🎫 Adding voucher ID to request:", voucherId, "as number:", parseInt(voucherId));
      } else {
        console.log("🎫 No voucher applied, sending request without voucher_id");
      }
      
      console.log("📤 Payment request body:", requestBody);
      console.log("📤 Making POST request to: /api/payments/payos/create");
      
      const response = await axios.post(
        "/api/payments/payos/create",
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Payment response received:");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.log("Response keys:", Object.keys(response.data || {}));

      if (response.data.checkoutUrl) {
        console.log("🔗 Checkout URL:", response.data.checkoutUrl);
        console.log("🔄 Redirecting to PayOS...");
        // Redirect to PayOS payment page
        window.location.href = response.data.checkoutUrl;
      } else {
        console.log("❌ No checkout URL in response");
        console.log("Available fields:", Object.keys(response.data || {}));
        setError("Không thể tạo link thanh toán. Vui lòng thử lại!");
      }

    } catch (err) {
      console.error("💥 Error creating payment:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        method: err.config?.method,
        requestBody: err.config?.data
      });

      if (err.response?.status === 401) {
        console.log("🔒 Unauthorized - redirecting to login");
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (err.response?.data?.message) {
        console.log("📝 Server error message:", err.response.data.message);
        setError(err.response.data.message);
      } else {
        console.log("❓ Unknown error occurred");
        setError("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
      console.log("🏁 Payment process finished");
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
