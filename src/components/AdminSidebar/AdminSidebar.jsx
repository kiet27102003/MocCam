import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  GiftOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import './AdminSidebar.css';

const AdminSidebar = ({ collapsed, onToggle, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      path: '/admin/users'
    },
    {
      key: '/admin/payments',
      icon: <DollarOutlined />,
      label: 'Quản lý thanh toán',
      path: '/admin/payments'
    },
    {
      key: '/admin/vouchers',
      icon: <GiftOutlined />,
      label: 'Quản lý voucher',
      path: '/admin/vouchers'
    },
    {
      key: '/admin/subscriptions',
      icon: <CreditCardOutlined />,
      label: 'Quản lý gói đăng ký',
      path: '/admin/subscriptions'
    },
    {
      key: '/admin/lessons',
      icon: <BookOutlined />,
      label: 'Quản lý khóa học',
      path: '/admin/lessons'
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Quản lý thông báo',
      path: '/admin/notifications'
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo',
      path: '/admin/reports'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      path: '/admin/settings'
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
    navigate('/login');
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
      
      <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            {(!collapsed || isMobile) && <span>Admin Panel</span>}
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
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title={collapsed ? 'Đăng xuất' : ''}
        >
          <span className="nav-icon"><LogoutOutlined /></span>
          {!collapsed && <span className="nav-label">Đăng xuất</span>}
        </button>
      </div>
      </div>
    </>
  );
};

export default AdminSidebar;
