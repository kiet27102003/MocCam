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
  LoadingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { notificationService } from '../../services/notificationService';
import './Header.css';
import mainLogo from '/mainLogo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, clearUserRole } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
      { label: 'Bảng xếp hạng', path: '/bangxephang', icon: <TrophyOutlined /> },
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
      { label: 'Hồ sơ cá nhân', path: '/HoSo', icon: <SettingOutlined /> },
      { label: 'Gói đăng ký', path: '/subscription', icon: <CrownOutlined /> },
      { label: 'Bảng xếp hạng', path: '/bangxephang', icon: <TrophyOutlined /> },
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
    <header className={`header ${userRole === 'customer' ? 'customer-header' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/home")}>
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
          {userRole === 'customer' && (
            <button className="upgrade-button" onClick={() => navigate('/subscription')}>
              <CrownOutlined />
              <span>Nâng cấp</span>
            </button>
          )}

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
                      <div className="user-role">{userRole?.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  {userMenuItems.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => { 
                        navigate(item.path); 
                        setIsUserMenuOpen(false); 
                      }} 
                      className="dropdown-item"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
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
