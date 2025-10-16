import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  GiftOutlined,
  BarChartOutlined,
  SafetyOutlined,
  HomeOutlined,
  SoundOutlined,
  TrophyOutlined,
  UserOutlined,
  CrownOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, getUserRoutes, clearUserRole } = useRole();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Icon mapping
  const iconMap = {
    dashboard: <DashboardOutlined />,
    users: <TeamOutlined />,
    courses: <BookOutlined />,
    payments: <DollarOutlined />,
    vouchers: <GiftOutlined />,
    reports: <BarChartOutlined />,
    settings: <SafetyOutlined />,
    home: <HomeOutlined />,
    subscription: <CrownOutlined />,
    profile: <UserOutlined />
  };

  // Get navigation items based on role
  const getNavigationItems = () => {
    const routes = getUserRoutes();
    return routes.map(route => ({
      ...route,
      icon: iconMap[route.icon] || <HomeOutlined />
    }));
  };

  const handleLogout = () => {
    clearUserRole();
    navigate('/');
  };

  const navItems = getNavigationItems();

  // Don't show sidebar for public pages
  if (!userRole || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">🎵</div>
          {!isCollapsed && (
            <div className="logo-text">
              <span className="brand-name">Mộc Cầm</span>
              <span className="role-badge">{userRole?.toUpperCase()}</span>
            </div>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <MenuOutlined /> : <CloseOutlined />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index} className="nav-item">
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  title={isCollapsed ? item.name : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span className="nav-text">{item.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserOutlined />}
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name">{user?.name || user?.email || 'Admin User'}</div>
              <div className="user-role">{userRole?.toUpperCase()}</div>
            </div>
          )}
        </div>
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? 'Đăng xuất' : ''}
        >
          <LogoutOutlined />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;