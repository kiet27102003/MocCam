import React, { useState, useEffect, useRef } from 'react';
import {
  CrownOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  SoundOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import mainLogo from '/mainLogo.png'; // Thay bằng đường dẫn logo của bạn

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <HomeOutlined /> },
    { label: 'Chọn nhạc cụ', path: '/home', icon: <SoundOutlined /> },
    { label: 'Bảng xếp hạng', path: '/bangxephang', icon: <TrophyOutlined /> },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src={mainLogo} alt="Logo" />
          <div className="logo-text">
            <span className="brand-name">Mộc Cầm</span>
            <span className="brand-tagline">Âm nhạc truyền thống</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="nav-menu desktop">
          {navItems.map(item => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button className="upgrade-button" onClick={() => navigate(user ? '/subscription' : '/login')}>
            <CrownOutlined />
            <span>Nâng cấp</span>
          </button>

          {user ? (
            <div className="user-menu-container" ref={userMenuRef} onClick={() => setIsUserMenuOpen(prev => !prev)}>
              <div className="user-button">
                <div className="user-avatar">
                  {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserOutlined />}
                </div>
                <span className="user-name">{user.name || user.email}</span>
              </div>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar-large">
                      {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserOutlined />}
                    </div>
                    <div>
                      <div className="user-name-large">{user.name || 'Người dùng'}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <button onClick={() => { navigate('/HoSo'); setIsUserMenuOpen(false); }} className="dropdown-item">
                    <SettingOutlined />
                    <span>Hồ sơ cá nhân</span>
                  </button>
                  <button onClick={() => { navigate('/subscription'); setIsUserMenuOpen(false); }} className="dropdown-item">
                    <CrownOutlined />
                    <span>Gói đăng ký</span>
                  </button>
                  <button onClick={() => { navigate('/bangxephang'); setIsUserMenuOpen(false); }} className="dropdown-item">
                    <TrophyOutlined />
                    <span>Bảng xếp hạng</span>
                  </button>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate('/login')}>
              <UserOutlined />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-button" onClick={() => setIsMenuOpen(prev => !prev)}>
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <a
              key={item.path}
              href={item.path}
              className={`mobile-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                setIsMenuOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
          <div className="dropdown-divider" />
          {user ? (
            <>
              <button className="mobile-link" onClick={() => { navigate('/HoSo'); setIsMenuOpen(false); }}>
                <SettingOutlined />
                <span>Hồ sơ</span>
              </button>
              <button className="mobile-link logout" onClick={handleLogout}>
                <LogoutOutlined />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <button className="mobile-link" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
              <UserOutlined />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
