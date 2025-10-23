import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TwitterOutlined, 
  InstagramOutlined, 
  FacebookOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import './Footer.css';
import mainLogo from '/mainLogo.png';

const Footer = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Chọn nhạc cụ', path: '/home' },
    { label: 'Đàn Tranh', path: '/dan-tranh' },
    { label: 'Bảng xếp hạng', path: '/bangxephang' },
    { label: 'Gói đăng ký', path: '/subscription' }
  ];

  const supportLinks = [
    { label: 'Hướng dẫn sử dụng', path: '/help' },
    { label: 'Câu hỏi thường gặp', path: '/faq' },
    { label: 'Liên hệ hỗ trợ', path: '/contact' },
    { label: 'Báo lỗi', path: '/bug-report' },
    { label: 'Góp ý', path: '/feedback' }
  ];

  const legalLinks = [
    { label: 'Điều khoản sử dụng', path: '/terms' },
    { label: 'Chính sách bảo mật', path: '/privacy' },
    { label: 'Chính sách hoàn tiền', path: '/refund' },
    { label: 'Bản quyền', path: '/copyright' }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FacebookOutlined />,
      url: 'https://www.facebook.com/profile.php?id=61581502762822',
      color: '#1877f2'
    },
    {
      name: 'Twitter',
      icon: <TwitterOutlined />,
      url: 'https://byvn.net/5fwj',
      color: '#1da1f2'
    },
    {
      name: 'Instagram',
      icon: <InstagramOutlined />,
      url: '#',
      color: '#e4405f'
    },
    {
      name: 'GitHub',
      icon: <GithubOutlined />,
      url: '#',
      color: '#333'
    },
  ];

  const handleLinkClick = (path) => {
    if (path.startsWith('#')) {
      return;
    }
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo" onClick={() => navigate("/home")}>
              <img src={mainLogo} alt="Mộc Cầm Logo" />
              <div className="brand-text">
                <span className="brand-name">Mộc Cầm</span>
                <span className="brand-tagline">Âm nhạc truyền thống</span>
              </div>
            </div>
            <p className="brand-description">
              Nền tảng học nhạc cụ truyền thống Việt Nam hàng đầu, 
              mang đến trải nghiệm học tập chất lượng cao với các giảng viên chuyên nghiệp.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <MailOutlined className="contact-icon" />
                <span>support@moccam.com</span>
              </div>
              <div className="contact-item">
                <PhoneOutlined className="contact-icon" />
                <span>+84 764 050 147</span>
              </div>
              <div className="contact-item">
                <EnvironmentOutlined className="contact-icon" />
                <span>FPT, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="link-section">
              <h4>Liên kết nhanh</h4>
              <ul>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleLinkClick(link.path)}
                      className="footer-link"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-section">
              <h4>Hỗ trợ</h4>
              <ul>
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleLinkClick(link.path)}
                      className="footer-link"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-section">
              <h4>Pháp lý</h4>
              <ul>
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleLinkClick(link.path)}
                      className="footer-link"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="footer-social">
          <div className="social-content">
            <h4>Theo dõi chúng tôi</h4>
            <p>Cập nhật tin tức và bài học mới nhất từ Mộc Cầm</p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ '--social-color': social.color }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Mộc Cầm. Tất cả quyền được bảo lưu.
            </p>
            <p className="made-with-love">
              Made with <HeartOutlined className="heart-icon" /> in Vietnam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;