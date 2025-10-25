import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    role: "customer", // mặc định là customer
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.full_name || !formData.email || !formData.password || !formData.phone_number) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Email không hợp lệ!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone_number)) {
      setError("Số điện thoại không hợp lệ!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/register/customer", formData);
      console.log("Đăng ký thành công:", res.data);

      setSuccess("Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError("Email đã được sử dụng!");
      } else if (err.response?.status === 400) {
        setError("Thông tin không hợp lệ!");
      } else {
        setError("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="register-header">
          <h2 className="register-title">
            TẠO TÀI KHOẢN MỚI CHO <span className="highlight">MỘC CẦM!</span>
          </h2>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-fields">
            <div className="input-group">
              <input
                type="text"
                name="full_name"
                placeholder="Họ và tên"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                autoComplete="name"
                className={error && !formData.full_name ? "error" : ""}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                className={error && !formData.email ? "error" : ""}
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
                className={error && !formData.password ? "error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone_number"
                placeholder="Số điện thoại"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
                autoComplete="tel"
                className={error && !formData.phone_number ? "error" : ""}
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`btn-register ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>

            <div className="form-links">
              <div className="login-link">
                Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
              </div>
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
