import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaXTwitter, FaEye, FaEyeSlash } from "react-icons/fa6";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRole } from "../../hooks/useRole";
import Footer from "../Footer/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { updateUserRole } = useRole();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Email không hợp lệ!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Đăng nhập thành công:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Update role context
        updateUserRole(response.data.user.role || 'customer', response.data.user);
        
        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      }

      // Navigate to default route based on user role
      const userRole = response.data.user.role || 'customer';
      let defaultRoute = '/home'; // Default fallback
      
      if (userRole === 'admin') {
        defaultRoute = '/admin';
      } else if (userRole === 'employee') {
        defaultRoute = '/employee';
      } else {
        defaultRoute = '/home';
      }
      
      console.log('Redirecting to:', defaultRoute, 'for role:', userRole);
      navigate(defaultRoute);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Sai tài khoản hoặc mật khẩu!");
      } else if (err.response?.status === 429) {
        setError("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau!");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      
      const token = credentialResponse.credential;

      // Gửi token Google sang backend để xác thực
      const response = await axios.post("/api/auth/google-login", { token });

      console.log("Đăng nhập Google thành công:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Update role context
        updateUserRole(response.data.user.role || 'customer', response.data.user);
        
        // Show success message for new users
        if (response.data.isNewUser) {
          console.log("Tài khoản mới được tạo qua Google!");
        }
      }

      // Navigate to default route based on user role
      const userRole = response.data.user.role || 'customer';
      let defaultRoute = '/home'; // Default fallback
      
      if (userRole === 'admin') {
        defaultRoute = '/admin';
      } else if (userRole === 'employee') {
        defaultRoute = '/employee';
      } else {
        defaultRoute = '/home';
      }
      
      console.log('Redirecting to:', defaultRoute, 'for role:', userRole);
      navigate(defaultRoute);
    } catch (err) {
      console.error("Lỗi đăng nhập Google:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Token Google không hợp lệ!");
      } else {
        setError("Không thể đăng nhập bằng Google. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Đăng nhập Google thất bại. Vui lòng thử lại!");
    setLoading(false);
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">
          CHÀO MỪNG BẠN TRỞ LẠI VỚI <span className="highlight">MỘC CẦM!</span>
        </h2>

        <form className="login-form" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
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

          {error && <p className="error-text">{error}</p>}

          <button 
            type="submit" 
            className={`btn-login ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="options">
            <label className="remember">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> 
              Ghi nhớ tài khoản
            </label>
            <a href="#" className="forgot">
              Quên mật khẩu?
            </a>
          </div>

          <div className="divider">
            <span>Hoặc đăng nhập bằng</span>
          </div>

          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
              logo_alignment="left"
              disabled={loading}
            />

            {/* Placeholder cho các social login khác */}
            <button type="button" className="social-btn disabled" disabled>
              <FaFacebookF />
            </button>
            <button type="button" className="social-btn disabled" disabled>
              <FaXTwitter />
            </button>
          </div>

          <div className="register">
            Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>
        </form>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/home")}
          disabled={loading}
        >
          Quay lại trang chủ
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
