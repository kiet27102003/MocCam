import React from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaXTwitter } from "react-icons/fa6";

const Register = () => {
  const navigate = useNavigate();

  // Ngăn reload khi submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    console.log("Đăng nhập thành công!");
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h2 className="login-title">
        CHÀO MỪNG BẠN ĐẾN VỚI{" "}
        <span className="highlight">MỘC CẦM!</span>
      </h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Tài khoản" />
          <input type="password" placeholder="Mật khẩu" />
          <input type="RePassword" placeholder="Xác nhận mật khẩu" />

          <button type="submit" className="btn-login">
            Đăng ký
          </button>

          <div className="options">
            <label className="remember">
              <input type="checkbox" /> Ghi nhớ mật khẩu
            </label>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn"><FaGoogle /></button>
            <button type="button" className="social-btn"><FaFacebookF /></button>
            <button type="button" className="social-btn"><FaXTwitter /></button>
          </div>

          <div className="register">
            Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
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

export default Register;
