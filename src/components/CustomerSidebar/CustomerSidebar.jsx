import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined,
  UserOutlined,
  CrownOutlined,
  BookOutlined,
  SoundOutlined,
  TrophyOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';
import './CustomerSidebar.css';

const CustomerSidebar = ({ collapsed, onToggle, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      path: '/home'
    },
    {
      key: '/instrument-select',
      icon: <SoundOutlined />,
      label: 'Chọn nhạc cụ',
      path: '/instrument-select'
    },
    {
      key: '/dan-tranh',
      icon: <PlayCircleOutlined />,
      label: 'Đàn Tranh',
      path: '/dan-tranh'
    },
    {
      key: '/dan-tranh/songs',
      icon: <BookOutlined />,
      label: 'Danh sách bài hát',
      path: '/dan-tranh/songs'
    },
    {
      key: '/dan-tranh/ranking',
      icon: <TrophyOutlined />,
      label: 'Bảng xếp hạng',
      path: '/dan-tranh/ranking'
    },
    {
      key: '/dan-tranh/profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      path: '/dan-tranh/profile'
    },
    {
      key: '/subscription',
      icon: <CrownOutlined />,
      label: 'Gói đăng ký',
      path: '/subscription'
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: 'Yêu thích',
      path: '/favorites'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      path: '/settings'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      onToggle && onToggle();
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`customer-sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🎵</div>
            {!collapsed && (
              <div className="logo-text">
                <span className="brand-name">Mộc Cầm</span>
                <span className="role-badge">CUSTOMER</span>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn"
            onClick={toggleSidebar}
          >
            {isMobile ? (isOpen ? <CloseOutlined /> : <MenuOutlined />) : <MenuOutlined />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.key} className="nav-item">
                <button
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.path)}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <UserOutlined />
            </div>
            {!collapsed && (
              <div className="user-details">
                <div className="user-name">Customer User</div>
                <div className="user-role">CUSTOMER</div>
              </div>
            )}
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title={collapsed ? 'Đăng xuất' : ''}
          >
            <LogoutOutlined />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerSidebar;
