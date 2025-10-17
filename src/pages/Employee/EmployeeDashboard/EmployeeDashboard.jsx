import React, { useState, useEffect } from 'react';
import { 
  UserOutlined, 
  BookOutlined, 
  DollarOutlined, 
  EyeOutlined, 
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    completedLessons: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    studentSatisfaction: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalStudents: 156,
        activeCourses: 8,
        completedLessons: 234,
        pendingTasks: 12,
        monthlyRevenue: 45000000,
        studentSatisfaction: 4.8
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
      title: 'Học viên của tôi',
      value: stats.totalStudents,
      icon: <UserOutlined />,
      color: '#4f46e5',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Khóa học đang dạy',
      value: stats.activeCourses,
      icon: <BookOutlined />,
      color: '#059669',
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Bài học đã hoàn thành',
      value: stats.completedLessons,
      icon: <CheckCircleOutlined />,
      color: '#dc2626',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Nhiệm vụ chờ xử lý',
      value: stats.pendingTasks,
      icon: <ClockCircleOutlined />,
      color: '#ea580c',
      change: '-3',
      trend: 'down'
    },
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <DollarOutlined />,
      color: '#7c3aed',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Đánh giá học viên',
      value: `${stats.studentSatisfaction}/5.0`,
      icon: <BarChartOutlined />,
      color: '#0891b2',
      change: '+0.2',
      trend: 'up'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Học viên mới đăng ký', user: 'Nguyễn Thị Lan', time: '5 phút trước', type: 'student' },
    { id: 2, action: 'Hoàn thành bài học', user: 'Đàn Tranh Bài 3', time: '20 phút trước', type: 'lesson' },
    { id: 3, action: 'Nhận đánh giá mới', user: '5 sao từ Minh Anh', time: '1 giờ trước', type: 'review' },
    { id: 4, action: 'Nhiệm vụ mới được giao', user: 'Tạo bài tập cho lớp A', time: '2 giờ trước', type: 'task' },
    { id: 5, action: 'Thanh toán được xác nhận', user: 'Gói Premium - 3 tháng', time: '3 giờ trước', type: 'payment' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'student': return <UserOutlined />;
      case 'lesson': return <BookOutlined />;
      case 'review': return <BarChartOutlined />;
      case 'task': return <ClockCircleOutlined />;
      case 'payment': return <DollarOutlined />;
      default: return <EyeOutlined />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'student': return '#4f46e5';
      case 'lesson': return '#059669';
      case 'review': return '#ea580c';
      case 'task': return '#dc2626';
      case 'payment': return '#7c3aed';
      default: return '#0891b2';
    }
  };

  const upcomingTasks = [
    { id: 1, title: 'Chuẩn bị bài học Đàn Tranh Bài 5', time: '14:00', priority: 'high' },
    { id: 2, title: 'Kiểm tra bài tập học viên lớp A', time: '16:00', priority: 'medium' },
    { id: 3, title: 'Tạo video hướng dẫn kỹ thuật mới', time: '18:00', priority: 'low' },
    { id: 4, title: 'Họp team định kỳ', time: '09:00 ngày mai', priority: 'high' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#ea580c';
      case 'low': return '#059669';
      default: return '#666666';
    }
  };

  if (loading) {
    return (
      <div className="employee-dashboard">
        <div className="dashboard-header">
          <h1>Dashboard Nhân viên</h1>
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
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Nhân viên</h1>
        <p>Chào mừng bạn trở lại với bảng điều khiển nhân viên</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: card.color }}>
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

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Recent Activities */}
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

        {/* Upcoming Tasks */}
        <div className="upcoming-tasks">
          <div className="section-header">
            <h2>Nhiệm vụ sắp tới</h2>
            <button className="view-all-btn">Xem tất cả</button>
          </div>
          <div className="tasks-list">
            {upcomingTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  <span className="priority-dot"></span>
                </div>
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-time">{task.time}</div>
                </div>
                <div className="task-status">
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="section-header">
          <h2>Thao tác nhanh</h2>
        </div>
        <div className="actions-grid">
          <button className="action-btn">
            <BookOutlined />
            <span>Tạo bài học</span>
          </button>
          <button className="action-btn">
            <UserOutlined />
            <span>Xem học viên</span>
          </button>
          <button className="action-btn">
            <BarChartOutlined />
            <span>Xem báo cáo</span>
          </button>
          <button className="action-btn">
            <ClockCircleOutlined />
            <span>Nhiệm vụ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
