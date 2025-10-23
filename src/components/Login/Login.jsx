import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaXTwitter, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRole } from "../../hooks/useRole";
import passwordResetService from "../../services/passwordResetService";

const Login = () => {
  const navigate = useNavigate();
  const { updateUserRole } = useRole();

  // Debug logging function
  const debugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 🔍 LOGIN DEBUG: ${message}`);
    if (data) {
      console.log(`[${timestamp}] 📊 Data:`, data);
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Forgot password modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    newPassword: ""
  });
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
    debugLog("🚀 Bắt đầu quá trình đăng nhập thông thường");
    setError("");
    setLoading(true);

    // Validation
    debugLog("✅ Kiểm tra validation");
    if (!formData.email || !formData.password) {
      debugLog("❌ Validation failed: Thiếu email hoặc password");
      setError("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      debugLog("❌ Validation failed: Email không hợp lệ", formData.email);
      setError("Email không hợp lệ!");
      setLoading(false);
      return;
    }

    debugLog("✅ Validation passed, gửi request đến backend");
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      debugLog("✅ Đăng nhập thành công", response.data);

      if (response.data.token) {
        debugLog("💾 Lưu token và user data vào localStorage");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Update role context
        debugLog("🔄 Cập nhật role context", response.data.user.role);
        updateUserRole(response.data.user.role || 'customer', response.data.user);
        
        // Remember me functionality
        if (rememberMe) {
          debugLog("💾 Lưu email để ghi nhớ");
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          debugLog("🗑️ Xóa email đã ghi nhớ");
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
      
      debugLog("🧭 Chuyển hướng đến route", { route: defaultRoute, role: userRole });
      navigate(defaultRoute);
    } catch (err) {
      debugLog("❌ Lỗi đăng nhập", err);
      
      if (err.response?.data?.message) {
        debugLog("📝 Error message từ backend", err.response.data.message);
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        debugLog("🔒 Unauthorized error (401)");
        setError("Sai tài khoản hoặc mật khẩu!");
      } else if (err.response?.status === 429) {
        debugLog("⏰ Rate limit error (429)");
        setError("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau!");
      } else {
        debugLog("🚨 Unknown error", err.message);
        setError("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      debugLog("🏁 Kết thúc quá trình đăng nhập thông thường");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    debugLog("🚀 Bắt đầu quá trình đăng nhập Google");
    try {
      setLoading(true);
      setError("");
      
      debugLog("📝 Nhận credential response từ Google", credentialResponse);
      const token = credentialResponse.credential;
      debugLog("🔑 Trích xuất token", token ? `${token.substring(0, 50)}...` : 'null');

      debugLog("🌐 Gửi token Google sang backend để xác thực");
      const response = await axios.post("/api/auth/google-login", { token });

      debugLog("✅ Đăng nhập Google thành công", response.data);

      if (response.data.token) {
        debugLog("💾 Lưu token và user data vào localStorage");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Update role context
        debugLog("🔄 Cập nhật role context", response.data.user.role);
        updateUserRole(response.data.user.role || 'customer', response.data.user);
        
        // Show success message for new users
        if (response.data.isNewUser) {
          debugLog("🎉 Tài khoản mới được tạo qua Google!");
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
      
      debugLog("🧭 Chuyển hướng đến route", { route: defaultRoute, role: userRole });
      navigate(defaultRoute);
    } catch (err) {
      debugLog("❌ Lỗi đăng nhập Google", err);
      
      if (err.response?.data?.message) {
        debugLog("📝 Error message từ backend", err.response.data.message);
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        debugLog("🔒 Token Google không hợp lệ (401)");
        setError("Token Google không hợp lệ!");
      } else {
        debugLog("🚨 Unknown Google login error", err.message);
        setError("Không thể đăng nhập bằng Google. Vui lòng thử lại!");
      }
    } finally {
      debugLog("🏁 Kết thúc quá trình đăng nhập Google");
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    debugLog("❌ Google login error callback triggered", error);
    
    // Handle specific COOP errors
    if (error.error === 'popup_failed_to_open' || 
        error.error === 'popup_closed_by_user' ||
        error.message?.includes('Cross-Origin-Opener-Policy')) {
      setError("Không thể mở cửa sổ đăng nhập. Vui lòng kiểm tra trình duyệt và thử lại!");
    } else {
      setError("Đăng nhập Google thất bại. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  // Forgot password modal functions
  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setForgotPasswordData({ email: "", newPassword: "" });
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setForgotPasswordData({ email: "", newPassword: "" });
    // Unlock body scroll
    document.body.style.overflow = 'unset';
  };

  const handleForgotPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (forgotPasswordError) setForgotPasswordError("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setForgotPasswordLoading(true);

    // Validation
    if (!forgotPasswordData.email || !forgotPasswordData.newPassword) {
      setForgotPasswordError("Vui lòng nhập đầy đủ thông tin!");
      setForgotPasswordLoading(false);
      return;
    }

    if (!validateEmail(forgotPasswordData.email)) {
      setForgotPasswordError("Email không hợp lệ!");
      setForgotPasswordLoading(false);
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setForgotPasswordError("Mật khẩu phải có ít nhất 6 ký tự!");
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await passwordResetService.resetPassword(
        forgotPasswordData.email, 
        forgotPasswordData.newPassword
      );

      console.log("Đặt lại mật khẩu thành công:", response);
      setForgotPasswordSuccess("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      
      // Đóng modal sau 2 giây
      setTimeout(() => {
        closeForgotPasswordModal();
      }, 2000);

    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err);
      
      if (err.response?.data?.message) {
        setForgotPasswordError(err.response.data.message);
      } else if (err.response?.status === 404) {
        setForgotPasswordError("Email không tồn tại trong hệ thống!");
      } else if (err.response?.status === 400) {
        setForgotPasswordError("Thông tin không hợp lệ!");
      } else {
        setForgotPasswordError("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    debugLog("🔄 Component mounted, kiểm tra remembered email");
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      debugLog("📧 Tìm thấy remembered email", rememberedEmail);
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    } else {
      debugLog("📧 Không có remembered email");
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
            <a href="#" className="forgot" onClick={(e) => { e.preventDefault(); openForgotPasswordModal(); }}>
              Quên mật khẩu?
            </a>
          </div>

          <div className="divider">
            <span>Hoặc đăng nhập bằng</span>
          </div>

          <div className="social-login">
            {debugLog("🎨 Rendering GoogleLogin component", { loading, disabled: loading })}
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
              useOneTap={false}
              auto_select={false}
              flow="auth-code"
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
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Quay lại trang chủ
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal-overlay" onClick={closeForgotPasswordModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đặt lại mật khẩu</h3>
              <button className="modal-close" onClick={closeForgotPasswordModal}>
                <FaTimes />
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleForgotPasswordSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
                  value={forgotPasswordData.email}
                  onChange={handleForgotPasswordInputChange}
                  required
                  autoComplete="email"
                  className={forgotPasswordError && !forgotPasswordData.email ? "error" : ""}
                />
              </div>

              <div className="input-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Mật khẩu mới"
                  value={forgotPasswordData.newPassword}
                  onChange={handleForgotPasswordInputChange}
                  required
                  autoComplete="new-password"
                  className={forgotPasswordError && !forgotPasswordData.newPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {forgotPasswordError && <p className="error-text">{forgotPasswordError}</p>}
              {forgotPasswordSuccess && <p className="success-text">{forgotPasswordSuccess}</p>}

              <div className="modal-actions">
                <button 
                  type="submit" 
                  className={`btn-submit ${forgotPasswordLoading ? "loading" : ""}`}
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
                
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={closeForgotPasswordModal}
                  disabled={forgotPasswordLoading}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
