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
import { userApi } from '../../config/api';

const HomeHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, clearUserRole } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  // Normalize user data để đảm bảo có đầy đủ các field (avatar từ picture, name từ full_name)
  const normalizeUser = (userData) => {
    if (!userData) return null;
    
    return {
      ...userData,
      avatar: userData.avatar || userData.picture || '',
      name: userData.name || userData.full_name || userData.email || '',
      picture: userData.picture || userData.avatar || '',
      full_name: userData.full_name || userData.name || '',
    };
  };
  

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          const userId = parsedUser?.user_id || parsedUser?.id;
          
          // Nếu có user_id, gọi API để lấy thông tin user đầy đủ
          if (userId) {
            try {
              const userResponse = await userApi.getUserById(userId);
              const fullUserData = userResponse.data;
              const normalizedUser = normalizeUser(fullUserData);
              setUser(normalizedUser);
              localStorage.setItem("user", JSON.stringify(normalizedUser));
            } catch (apiErr) {
              // Nếu API fail, sử dụng data từ localStorage
              console.warn("⚠️ Không thể lấy thông tin user từ API, sử dụng data từ localStorage", apiErr);
              const normalizedUser = normalizeUser(parsedUser);
              setUser(normalizedUser);
            }
          } else {
            // Nếu không có user_id, chỉ normalize data từ localStorage
            const normalizedUser = normalizeUser(parsedUser);
            setUser(normalizedUser);
            localStorage.setItem("user", JSON.stringify(normalizedUser));
          }
        } catch (parseErr) {
          console.error("❌ Lỗi parse user data từ localStorage", parseErr);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUserData();
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
    // Normalize user data trước khi lưu
    const normalizedUser = normalizeUser(updatedUser);
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
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
                    {(user.avatar || user.picture) ? <img src={user.avatar || user.picture} alt="Avatar" /> : <UserOutlined />}
                  </div>
                  <span className="home-user-name">{user.name || user.full_name || user.email}</span>
                </div>

                {isUserMenuOpen && (
                  <div className="home-user-dropdown">
                    <div className="home-user-info">
                      <div className="home-user-avatar-large">
                        {(user.avatar || user.picture) ? <img src={user.avatar || user.picture} alt="Avatar" /> : <UserOutlined />}
                      </div>
                      <div>
                        <div className="home-user-name-large">{user.name || user.full_name || 'Người dùng'}</div>
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
