import React from 'react';
import { TwitterOutlined, InstagramOutlined, FacebookOutlined } from '@ant-design/icons';
import './Header.css';
import mainLogo from '/mainLogo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={mainLogo} alt="Logo" />
        </div>

        <div className="header-right">
          <nav className="nav-menu">
            <a href="#about" className="nav-link">About us</a>
            <a href="#vision" className="nav-link">Vision</a>
          </nav>

          <div className="social-icons">
            <a href="https://byvn.net/5fwj" className="social-link" aria-label="Twitter" style={{ color: "#ce1c1c", fontSize: "24px" }}
              >
                <TwitterOutlined />
              </a>
            <a href="#" className="social-link" aria-label="Instagram" style={{ color: "#ce1c1c", fontSize: "24px" }}>
              <InstagramOutlined />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61581502762822"
              className="social-link"
              aria-label="Facebook"
              style={{ color: "#ce1c1c", fontSize: "24px" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookOutlined />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
