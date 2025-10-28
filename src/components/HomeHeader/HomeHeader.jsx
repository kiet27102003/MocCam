import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { 
  UserOutlined, 
  LoginOutlined, 
  MenuOutlined, 
  CloseOutlined,
  CrownOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  SoundOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import './HomeHeader.css';
import mainLogo from '/mainLogo.png';
import ProfileModal from '../ProfileModal/ProfileModal';

const HomeHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, clearUserRole } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    clearUserRole();
    setUser(null);
    navigate("/");
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const getNavigationItems = () => {
    return [
      { label: 'Trang chủ', path: '/', icon: <HomeOutlined /> },
      { label: 'Chọn nhạc cụ', path: '/home', icon: <SoundOutlined /> },
      { label: 'Gói nâng cấp', path: '/subscription', icon: <CrownOutlined /> },
    ];
  };

  const getUserMenuItems = () => {
    return [
      { label: 'Hồ sơ cá nhân', path: null, icon: <SettingOutlined /> },
      { label: 'Gói đăng ký', path: '/subscription', icon: <CrownOutlined /> },
    ];
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const navItems = getNavigationItems();
  const userMenuItems = getUserMenuItems();

  return (
    <>
      <header className="home-header">
        <div className="home-header-container">
          {/* Logo */}
          <div className="home-logo" onClick={() => navigate("/home")}>
            <img src={mainLogo} alt="Logo" />
            <div className="home-logo-text">
              <span className="home-brand-name">Mộc Cầm</span>
              <span className="home-brand-tagline">Âm nhạc truyền thống</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="home-nav-menu desktop">
            {navItems.map(item => (
              <a
                key={item.path}
                href={item.path}
                className={`home-nav-link ${location.pathname === item.path ? 'active' : ''}`}
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
          <div className="home-header-actions">
            {user ? (
              <div className="home-user-menu-container" onClick={() => setIsUserMenuOpen(prev => !prev)}>
                <div className="home-user-button">
                  <div className="home-user-avatar">
                    {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserOutlined />}
                  </div>
                  <span className="home-user-name">{user.name || user.email}</span>
                </div>

                {isUserMenuOpen && (
                  <div className="home-user-dropdown">
                    <div className="home-user-info">
                      <div className="home-user-avatar-large">
                        {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserOutlined />}
                      </div>
                      <div>
                        <div className="home-user-name-large">{user.name || 'Người dùng'}</div>
                        <div className="home-user-email">{user.email}</div>
                        <div className="home-user-role">{userRole?.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="home-dropdown-divider" />
                    {userMenuItems.map((item, index) => (
                      <button 
                        key={index}
                        onClick={() => { 
                          if (item.path) {
                            navigate(item.path);
                          } else {
                            setIsProfileModalVisible(true);
                          }
                          setIsUserMenuOpen(false); 
                        }} 
                        className="home-dropdown-item"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <div className="home-dropdown-divider" />
                    <button onClick={handleLogout} className="home-dropdown-item logout">
                      <LogoutOutlined />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="home-login-button" onClick={() => navigate('/login')}>
                <LoginOutlined />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="home-mobile-menu-button" onClick={() => setIsMenuOpen(prev => !prev)}>
              {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="home-mobile-menu">
            {navItems.map(item => (
              <a
                key={item.path}
                href={item.path}
                className={`home-mobile-link ${location.pathname === item.path ? 'active' : ''}`}
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
            <div className="home-dropdown-divider" />
            {user ? (
              <>
                <button className="home-mobile-link" onClick={() => { setIsProfileModalVisible(true); setIsMenuOpen(false); }}>
                  <SettingOutlined />
                  <span>Hồ sơ</span>
                </button>
                <button className="home-mobile-link logout" onClick={handleLogout}>
                  <LogoutOutlined />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <button className="home-mobile-link" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                <LoginOutlined />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Profile Modal - Rendered outside header */}
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        userData={user}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
};

export default HomeHeader;
