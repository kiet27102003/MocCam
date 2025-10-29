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
  TrophyOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  BarChartOutlined,
  SafetyOutlined,
  GiftOutlined,
  BellOutlined,
  LoadingOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { notificationService } from '../../services/notificationService';
import ProfileModal from '../ProfileModal/ProfileModal';
import '../../components/HomeHeader/HomeHeader.css';
import mainLogo from '/mainLogo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, clearUserRole } = useRole();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
      setNotifications([]);
    }
  }, [location]);

  // Fetch notifications when user is logged in and has customer role
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && userRole === 'customer') {
        setIsLoadingNotifications(true);
        setNotificationError(null);
        try {
          const response = await notificationService.getNotifications();
          // Assuming the API returns notifications in response.data or response.notifications
          const notificationData = response.data || response.notifications || response;
          setNotifications(notificationData);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotificationError('Không thể tải thông báo');
          setNotifications([]);
        } finally {
          setIsLoadingNotifications(false);
        }
      }
    };

    fetchNotifications();
  }, [user, userRole]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (isNotificationOpen && notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isNotificationOpen]);

  const handleLogout = () => {
    clearUserRole();
    setUser(null);
    navigate("/");
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    console.log('👤 [Header] Mở ProfileModal:', {
      userId: user?.id,
      userName: user?.full_name || user?.name,
      timestamp: new Date().toISOString()
    });
    setProfileModalVisible(true);
    setIsUserMenuOpen(false);
  };

  // Handle navigation click
  const handleNavigationClick = (item, e) => {
    e.preventDefault();
    navigate(item.path);
  };

  const handleProfileUpdated = (updatedUser) => {
    console.log('🔄 [Header] Profile đã được cập nhật:', {
      userId: updatedUser?.id,
      updatedFields: Object.keys(updatedUser),
      timestamp: new Date().toISOString()
    });
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return notificationDate.toLocaleDateString('vi-VN');
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Trang chủ', path: '/', icon: <HomeOutlined /> },
      { label: 'Chọn nhạc cụ', path: '/home', icon: <SoundOutlined /> },
      { label: 'Nâng cấp', path: '/subscription', icon: <CrownOutlined /> },
    ];

    // Add role-specific items
    if (userRole === 'admin') {
      baseItems.push(
        { label: 'Dashboard', path: '/admin', icon: <DashboardOutlined /> },
        { label: 'Người dùng', path: '/admin/users', icon: <TeamOutlined /> },
        { label: 'Khóa học', path: '/admin/courses', icon: <BookOutlined /> },
        { label: 'Thanh toán', path: '/admin/payments', icon: <DollarOutlined /> },
        { label: 'Voucher', path: '/admin/vouchers', icon: <GiftOutlined /> },
        { label: 'Báo cáo', path: '/admin/reports', icon: <BarChartOutlined /> }
      );
    } else if (userRole === 'employee') {
      baseItems.push(
        { label: 'Dashboard', path: '/employee', icon: <DashboardOutlined /> },
        { label: 'Khóa học', path: '/employee/courses', icon: <BookOutlined /> },
        { label: 'Người dùng', path: '/employee/users', icon: <TeamOutlined /> },
        { label: 'Báo cáo', path: '/employee/reports', icon: <BarChartOutlined /> }
      );
    }

    return baseItems;
  };

  // Get user menu items based on role
  const getUserMenuItems = () => {
    const baseItems = [
      { label: 'Hồ sơ cá nhân', action: 'profile', icon: <EditOutlined /> },
      { label: 'Quản lý gói', path: '/my-subscriptions', icon: <CrownOutlined /> },
    ];

    // Add role-specific menu items
    if (userRole === 'admin') {
      baseItems.unshift(
        { label: 'Admin Dashboard', path: '/admin', icon: <DashboardOutlined /> },
        { label: 'Quản lý người dùng', path: '/admin/users', icon: <TeamOutlined /> },
        { label: 'Quản lý khóa học', path: '/admin/courses', icon: <BookOutlined /> },
        { label: 'Quản lý thanh toán', path: '/admin/payments', icon: <DollarOutlined /> },
        { label: 'Quản lý Voucher', path: '/admin/vouchers', icon: <GiftOutlined /> },
        { label: 'Báo cáo', path: '/admin/reports', icon: <BarChartOutlined /> },
        { label: 'Cài đặt hệ thống', path: '/admin/settings', icon: <SafetyOutlined /> }
      );
    } else if (userRole === 'employee') {
      baseItems.unshift(
        { label: 'Employee Dashboard', path: '/employee', icon: <DashboardOutlined /> },
        { label: 'Khóa học', path: '/employee/courses', icon: <BookOutlined /> },
        { label: 'Người dùng', path: '/employee/users', icon: <TeamOutlined /> },
        { label: 'Báo cáo', path: '/employee/reports', icon: <BarChartOutlined /> }
      );
    }

    return baseItems;
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
              onClick={(e) => handleNavigationClick(item, e)}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="home-header-actions">
          {/* Notification bell for users */}
          {user && userRole === 'customer' && (
            <div className="notification-container" ref={notificationRef}>
              <button 
                className="notification-button" 
                onClick={() => setIsNotificationOpen(prev => !prev)}
              >
                <BellOutlined />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length > 99 ? '99+' : notifications.length}</span>
                )}
              </button>
              
              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Thông báo</h4>
                  </div>
                  <div className="notification-list">
                    {isLoadingNotifications ? (
                      <div className="notification-loading">
                        <LoadingOutlined />
                        <span>Đang tải thông báo...</span>
                      </div>
                    ) : notificationError ? (
                      <div className="notification-error">
                        <span>{notificationError}</span>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="notification-empty">
                        <span>Không có thông báo nào</span>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id}
                          className="notification-item"
                        >
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">
                              {formatTimeAgo(notification.createdAt || notification.created_at)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="notification-footer">
                      <button className="view-all-notifications">
                        Xem tất cả thông báo ({notifications.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Only show upgrade button for customers */}
          {/* {userRole === 'customer' && (
            <button className="upgrade-button" onClick={() => navigate('/subscription')}>
              <CrownOutlined />
              <span>Nâng cấp</span>
            </button>
          )} */}

          {user ? (
            <div className="home-user-menu-container" ref={userMenuRef} onClick={() => setIsUserMenuOpen(prev => !prev)}>
              <div className="home-user-button">
                <div className="home-user-avatar">
                  {user.picture ? <img src={user.picture} alt="Avatar" /> : <UserOutlined />}
                </div>
                <span className="home-user-name">{user.full_name || user.name || user.email}</span>
              </div>

              {isUserMenuOpen && (
                <div className="home-user-dropdown">
                  <div className="home-user-info">
                    <div className="home-user-avatar-large">
                      {user.picture ? <img src={user.picture} alt="Avatar" /> : <UserOutlined />}
                    </div>
                    <div>
                      <div className="home-user-name-large">{user.full_name || user.name || 'Người dùng'}</div>
                      <div className="home-user-email">{user.email}</div>
                      <div className="home-user-role">{userRole?.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="home-dropdown-divider" />
                  {userMenuItems.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => { 
                        if (item.action === 'profile') {
                          handleProfileClick();
                        } else {
                          navigate(item.path); 
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
              <UserOutlined />
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
              <button className="home-mobile-link" onClick={() => { handleProfileClick(); setIsMenuOpen(false); }}>
                <EditOutlined />
                <span>Hồ sơ cá nhân</span>
              </button>
              <button className="home-mobile-link logout" onClick={handleLogout}>
                <LogoutOutlined />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <button className="home-mobile-link" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
              <UserOutlined />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      )}

    </header>

    {/* Profile Modal - Outside header to avoid positioning issues */}
    <ProfileModal
      visible={profileModalVisible}
      onClose={() => setProfileModalVisible(false)}
      userData={user}
      onProfileUpdated={handleProfileUpdated}
    />
    </>
  );
};

export default Header;
