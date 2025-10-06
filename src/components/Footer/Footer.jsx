import React from 'react';
import { TwitterOutlined, InstagramOutlined, FacebookFilled } from '@ant-design/icons';
import './Footer.css';
import mainLogo from '/mainLogo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-white-section">
        <div className="footer-curve"></div>
      </div>
      
      <div className="footer-red-section">
        <div className="footer-container">

          <div className="musical-notes">
            <div className="note note-1">♪</div>
            <div className="note note-2">♫</div>
            <div className="note note-3">♪</div>
            <div className="note note-4">●</div>
          </div>
          
          <div className="footer-content">
            <div className="footer-left">
            <div className="logo">
              <img src={mainLogo} alt="Logo" />
            </div>
              <div className="footer-text">
                <h3>CHẠM VÀO HƯ KHÔNG,<br />GÂY NÊN GIAI ĐIỆU</h3>
              </div>
            </div>
            
            <div className="footer-right">
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter">
                  <TwitterOutlined style={{ fontSize: 24 }} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <InstagramOutlined style={{ fontSize: 24 }} />
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <FacebookFilled style={{ fontSize: 24 }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
