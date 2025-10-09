import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaXTwitter } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();

  // Ngăn reload khi submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    navigate("/home"); //giả lập
    console.log("Đăng nhập thành công!");
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h2 className="login-title">
        CHÀO MỪNG BẠN TRỞ LẠI VỚI{" "}
        <span className="highlight">MỘC CẦM!</span>
      </h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Tài khoản" />
          <input type="password" placeholder="Mật khẩu" />

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>

          <div className="options">
            <label className="remember">
              <input type="checkbox" /> Ghi nhớ mật khẩu
            </label>
            <a href="#" className="forgot">
              Quên mật khẩu?
            </a>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn"><FaGoogle /></button>
            <button type="button" className="social-btn"><FaFacebookF /></button>
            <button type="button" className="social-btn"><FaXTwitter /></button>
          </div>

          <div className="register">
            Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
          </div>
        </form>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/home")}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default Login;
