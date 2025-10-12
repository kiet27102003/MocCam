import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("api/auth/login", {
        email,
        password,
      });

      console.log("Đăng nhập thành công:", res.data);

      // Nếu backend trả về token hoặc user info → lưu lại
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/home"); // Chuyển sang trang chủ
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Sai tài khoản hoặc mật khẩu!");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">
          CHÀO MỪNG BẠN TRỞ LẠI VỚI <span className="highlight">MỘC CẦM!</span>
        </h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tài khoản (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

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
