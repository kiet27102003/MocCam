import React, { useState, useEffect } from 'react';
import { 
  UserOutlined, 
  BookOutlined, 
  DollarOutlined, 
  GiftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './AdminDashboard.css';
import { API_ENDPOINTS, getEndpointUrl } from '../../../config/api';
import Chart from '../../../components/Chart/Chart';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalVouchers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('users');
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    users: Array(12).fill(0),
    courses: Array(12).fill(0),
    revenue: Array(12).fill(0),
    vouchers: Array(12).fill(0)
  });
  const [chartLoading, setChartLoading] = useState(false);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Generate mock monthly data (replace with real API calls)
  const generateMonthlyData = (type, year) => {
    // This is mock data - replace with real API calls to get monthly statistics
    const baseValues = {
      users: [15, 23, 18, 31, 25, 28, 35, 42, 38, 45, 52, 48],
      courses: [3, 5, 2, 7, 4, 6, 8, 9, 7, 11, 13, 10],
      revenue: [2500000, 3800000, 2200000, 4500000, 3200000, 4100000, 5200000, 6800000, 5900000, 7200000, 8500000, 7800000],
      vouchers: [2, 4, 1, 6, 3, 5, 7, 8, 6, 9, 12, 10]
    };
    
    // Add some variation based on year (older years have less data)
    const yearMultiplier = Math.max(0.5, 1 - (new Date().getFullYear() - year) * 0.1);
    
    return baseValues[type].map(value => Math.round(value * yearMultiplier));
  };

  // Fetch chart data for selected type and year
  const fetchChartData = async (type, year) => {
    setChartLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const monthlyData = generateMonthlyData(type, year);
      
      setChartData(prev => ({
        ...prev,
        [type]: monthlyData
      }));
    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setChartLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch data from multiple endpoints in parallel
      const [usersResponse, coursesResponse, vouchersResponse, paymentsResponse] = await Promise.all([
        fetch(getEndpointUrl('USERS'), { headers }),
        fetch(getEndpointUrl('COURSES'), { headers }),
        fetch(getEndpointUrl('VOUCHERS'), { headers }),
        fetch(getEndpointUrl('PAYMENTS'), { headers })
      ]);

      const [users, courses, vouchers, payments] = await Promise.all([
        usersResponse.ok ? usersResponse.json() : [],
        coursesResponse.ok ? coursesResponse.json() : [],
        vouchersResponse.ok ? vouchersResponse.json() : [],
        paymentsResponse.ok ? paymentsResponse.json() : []
      ]);

      // Calculate total revenue from payments
      const totalRevenue = payments.reduce((sum, payment) => {
        return sum + (payment.amount || 0);
      }, 0);

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalCourses: Array.isArray(courses) ? courses.length : 0,
        totalRevenue: totalRevenue,
        totalVouchers: Array.isArray(vouchers) ? vouchers.length : 0
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchChartData(selectedChart, chartYear);
  }, [selectedChart, chartYear]);


  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: <UserOutlined />,
      change: '+12%',
      trend: 'up',
      key: 'users'
    },
    {
      title: 'Khóa học',
      value: stats.totalCourses,
      icon: <BookOutlined />,
      change: '+5%',
      trend: 'up',
      key: 'courses'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarOutlined />,
      change: '+18%',
      trend: 'up',
      key: 'revenue'
    },
    {
      title: 'Voucher',
      value: stats.totalVouchers,
      icon: <GiftOutlined />,
      change: '+3%',
      trend: 'up',
      key: 'vouchers'
    }
  ];

  const handleStatCardClick = (cardKey) => {
    setSelectedChart(cardKey);
  };

  const handleYearChange = (year) => {
    setChartYear(year);
  };

  const getChartTitle = () => {
    const titles = {
      users: 'Thống kê người dùng theo tháng',
      courses: 'Thống kê khóa học theo tháng',
      revenue: 'Thống kê doanh thu theo tháng',
      vouchers: 'Thống kê voucher theo tháng'
    };
    return titles[selectedChart] || 'Thống kê theo tháng';
  };


  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Chào mừng bạn trở lại với bảng điều khiển quản trị</p>
        </div>
        <button 
          className="refresh-btn"
          onClick={fetchDashboardStats}
          disabled={loading}
        >
          <ReloadOutlined />
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardStats}>Thử lại</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className={`stat-card ${selectedChart === card.key ? 'selected' : ''}`}
            onClick={() => handleStatCardClick(card.key)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-icon">
              {card.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {loading ? '...' : card.value}
              </div>
              <div className="stat-title">{card.title}</div>
              <div className={`stat-change ${card.trend}`}>
                {card.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      {chartLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải biểu đồ...</p>
          </div>
        </div>
      ) : (
        <Chart 
          data={chartData[selectedChart]}
          title={getChartTitle()}
          year={chartYear}
          onYearChange={handleYearChange}
        />
      )}

    </div>
  );
};

export default AdminDashboard;
