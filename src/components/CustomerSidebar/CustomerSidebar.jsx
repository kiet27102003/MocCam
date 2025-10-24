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
  HeartOutlined,
  EditOutlined
} from '@ant-design/icons';
import ProfileModal from '../ProfileModal/ProfileModal';
import './CustomerSidebar.css';

const CustomerSidebar = ({ collapsed, onToggle, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user data from localStorage
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

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

  const handleProfileClick = () => {
    setProfileModalVisible(true);
  };

  const handleProfileUpdated = (updatedUser) => {
    setUserData(updatedUser);
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
          <div className="user-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">
              {userData?.picture ? (
                <img src={userData.picture} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <UserOutlined />
              )}
            </div>
            {!collapsed && (
              <div className="user-details">
                <div className="user-name">{userData?.full_name || 'Customer User'}</div>
                <div className="user-role">{userData?.role?.toUpperCase() || 'CUSTOMER'}</div>
              </div>
            )}
            {!collapsed && (
              <EditOutlined className="edit-profile-icon" />
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

      {/* Profile Modal */}
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
};

export default CustomerSidebar;
