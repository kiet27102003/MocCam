import React, { useState, useEffect } from 'react';
import { 
  UserOutlined, 
  BookOutlined, 
  DollarOutlined, 
  GiftOutlined, 
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined
} from '@ant-design/icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalVouchers: 0,
    activeUsers: 0,
    completedCourses: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalCourses: 45,
        totalRevenue: 125000000,
        totalVouchers: 12,
        activeUsers: 890,
        completedCourses: 320
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: <UserOutlined />,
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Khóa học',
      value: stats.totalCourses,
      icon: <BookOutlined />,
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarOutlined />,
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Voucher',
      value: stats.totalVouchers,
      icon: <GiftOutlined />,
      change: '+3%',
      trend: 'up'
    },
    {
      title: 'Người dùng hoạt động',
      value: stats.activeUsers,
      icon: <EyeOutlined />,
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Khóa học hoàn thành',
      value: stats.completedCourses,
      icon: <BarChartOutlined />,
      change: '+15%',
      trend: 'up'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '2 phút trước', type: 'user' },
    { id: 2, action: 'Khóa học mới được tạo', user: 'Đàn Tranh Cơ Bản', time: '15 phút trước', type: 'course' },
    { id: 3, action: 'Thanh toán thành công', user: 'Gói Premium', time: '1 giờ trước', type: 'payment' },
    { id: 4, action: 'Voucher mới được tạo', user: 'Giảm 20%', time: '2 giờ trước', type: 'voucher' },
    { id: 5, action: 'Báo cáo được tạo', user: 'Báo cáo tháng', time: '3 giờ trước', type: 'report' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <UserOutlined />;
      case 'course': return <BookOutlined />;
      case 'payment': return <DollarOutlined />;
      case 'voucher': return <GiftOutlined />;
      case 'report': return <BarChartOutlined />;
      default: return <EyeOutlined />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return '#4f46e5';
      case 'course': return '#059669';
      case 'payment': return '#dc2626';
      case 'voucher': return '#7c3aed';
      case 'report': return '#ea580c';
      default: return '#0891b2';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Chào mừng bạn trở lại với bảng điều khiển quản trị</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              {card.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{card.value}</div>
              <div className="stat-title">{card.title}</div>
              <div className={`stat-change ${card.trend}`}>
                {card.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="dashboard-content">
        <div className="recent-activities">
          <div className="section-header">
            <h2>Hoạt động gần đây</h2>
            <button className="view-all-btn">Xem tất cả</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-user">{activity.user}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="section-header">
            <h2>Thao tác nhanh</h2>
          </div>
          <div className="actions-grid">
            <button className="action-btn">
              <UserOutlined />
              <span>Tạo người dùng</span>
            </button>
            <button className="action-btn">
              <BookOutlined />
              <span>Tạo khóa học</span>
            </button>
            <button className="action-btn">
              <GiftOutlined />
              <span>Tạo voucher</span>
            </button>
            <button className="action-btn">
              <BarChartOutlined />
              <span>Xem báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
