import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './EmployeeSidebar.css';

const EmployeeSidebar = ({ collapsed, onToggle, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/employee',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/employee'
    },
    {
      key: '/employee/courses',
      icon: <BookOutlined />,
      label: 'Khóa học',
      path: '/employee/courses'
    },
    {
      key: '/employee/users',
      icon: <UserOutlined />,
      label: 'Học viên',
      path: '/employee/users'
    },
    {
      key: '/employee/reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo',
      path: '/employee/reports'
    },
    {
      key: '/employee/tasks',
      icon: <FileTextOutlined />,
      label: 'Nhiệm vụ',
      path: '/employee/tasks'
    },
    {
      key: '/employee/team',
      icon: <TeamOutlined />,
      label: 'Đội ngũ',
      path: '/employee/team'
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
    localStorage.removeItem('token');
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
      
      <div className={`employee-sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            {(!collapsed || isMobile) && <span>Nhân viên</span>}
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

export default EmployeeSidebar;
