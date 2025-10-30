import React, { useState, useEffect, useCallback } from 'react';
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
    totalRevenue: Array(12).fill(0),
    vouchers: Array(12).fill(0)
  });
  const [chartLoading, setChartLoading] = useState(false);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };


  // Fetch chart data for selected type
  const fetchChartData = useCallback(async (type) => {
    setChartLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let endpointKey;
      switch (type) {
        case 'users':
          endpointKey = 'DASHBOARD_USER_STATS_BY_MONTH';
          break;
        case 'vouchers':
          endpointKey = 'DASHBOARD_VOUCHER_STATS_BY_MONTH';
          break;
        case 'totalRevenue':
          endpointKey = 'DASHBOARD_REVENUE_STATS_BY_MONTH';
          break;
        case 'courses':
          endpointKey = 'DASHBOARD_LESSON_STATS_BY_MONTH'; // Using lesson stats for courses
          break;
        default:
          endpointKey = null;
      }

      if (endpointKey) {
        const response = await fetch(getEndpointUrl(endpointKey), { headers });
        
        if (response.ok) {
          const statsData = await response.json();
          
          // Log the API response for debugging
          console.log(`📊 ${type.toUpperCase()} Stats API Response:`, statsData);
          
          // Process the API response to get monthly data
          const monthlyData = Array(12).fill(0);
          
          // If the API returns data in a specific format, process it accordingly
          if (Array.isArray(statsData)) {
            statsData.forEach(item => {
              // Handle different data structures
              if (item.month >= 1 && item.month <= 12) {
                // API returns month as 1-12, but array index is 0-11
                const arrayIndex = item.month - 1;
                monthlyData[arrayIndex] = item.totalRevenue || item.count || item.amount || 0;
              } else if (item.month >= 0 && item.month < 12) {
                // Handle 0-based month indexing
                monthlyData[item.month] = item.totalRevenue || item.count || item.amount || 0;
              }
            });
          } else if (statsData.monthlyData && Array.isArray(statsData.monthlyData)) {
            statsData.monthlyData.forEach(item => {
              if (item.month >= 1 && item.month <= 12) {
                const arrayIndex = item.month - 1;
                monthlyData[arrayIndex] = item.totalRevenue || item.count || item.amount || 0;
              } else if (item.month >= 0 && item.month < 12) {
                monthlyData[item.month] = item.totalRevenue || item.count || item.amount || 0;
              }
            });
          }
          
          setChartData(prev => ({
            ...prev,
            [type]: monthlyData
          }));
          
          // Log processed monthly data
          console.log(`📈 ${type.toUpperCase()} Processed Monthly Data:`, monthlyData);
        } else {
          console.error(`Failed to fetch ${type} stats:`, response.statusText);
          // Keep existing data if API fails
        }
      } else {
        console.warn(`Unknown chart type: ${type}`);
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      // Keep existing data on error
    } finally {
      setChartLoading(false);
    }
  }, []);

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

      // Log API endpoints being called
      console.log('🚀 FETCHING DASHBOARD DATA FROM:');
      console.log('User Stats Endpoint:', getEndpointUrl('DASHBOARD_USER_STATS_BY_MONTH'));
      console.log('Voucher Stats Endpoint:', getEndpointUrl('DASHBOARD_VOUCHER_STATS_BY_MONTH'));
      console.log('Revenue Stats Endpoint:', getEndpointUrl('DASHBOARD_REVENUE_STATS_BY_MONTH'));
      console.log('Lesson Stats Endpoint:', getEndpointUrl('DASHBOARD_LESSON_STATS_BY_MONTH'));

      // Fetch data from multiple endpoints in parallel
      const [userStatsResponse, voucherStatsResponse, revenueStatsResponse, lessonStatsResponse] = await Promise.all([
        fetch(getEndpointUrl('DASHBOARD_USER_STATS_BY_MONTH'), { headers }),
        fetch(getEndpointUrl('DASHBOARD_VOUCHER_STATS_BY_MONTH'), { headers }),
        fetch(getEndpointUrl('DASHBOARD_REVENUE_STATS_BY_MONTH'), { headers }),
        fetch(getEndpointUrl('DASHBOARD_LESSON_STATS_BY_MONTH'), { headers })
      ]);

      const [userStatsData, voucherStatsData, revenueStatsData, lessonStatsData] = await Promise.all([
        userStatsResponse.ok ? userStatsResponse.json() : null,
        voucherStatsResponse.ok ? voucherStatsResponse.json() : null,
        revenueStatsResponse.ok ? revenueStatsResponse.json() : null,
        lessonStatsResponse.ok ? lessonStatsResponse.json() : null
      ]);

      // Log all dashboard API responses
      console.log('🔍 DASHBOARD API RESPONSES:');
      console.log('👥 User Stats:', userStatsData);
      console.log('🎫 Voucher Stats:', voucherStatsData);
      console.log('💰 Revenue Stats:', revenueStatsData);
      console.log('📚 Lesson Stats:', lessonStatsData);

      // Helper function to calculate totals from API data
      const calculateTotal = (data) => {
        if (!data) return 0;
      
        if (Array.isArray(data)) {
          return data.reduce((sum, item) => {
            const value = Number(item.totalRevenue || item.count || item.amount || 0);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
        }
      
        if (data.monthlyData && Array.isArray(data.monthlyData)) {
          return data.monthlyData.reduce((sum, item) => {
            const value = Number(item.totalRevenue || item.count || item.amount || 0);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
        }
      
        if (typeof data.totalRevenue === 'string' || typeof data.totalRevenue === 'number') {
          return Number(data.totalRevenue);
        }
      
        return 0;
      };
      

      const calculatedStats = {
        totalUsers: calculateTotal(userStatsData),
        totalCourses: calculateTotal(lessonStatsData), // Using lesson stats for courses
        totalRevenue: calculateTotal(revenueStatsData),
        totalVouchers: calculateTotal(voucherStatsData)
      };

      // Log calculated stats
      console.log('📊 CALCULATED DASHBOARD STATS:');
      console.log('Total Users:', calculatedStats.totalUsers);
      console.log('Total Courses:', calculatedStats.totalCourses);
      console.log('Total Revenue:', calculatedStats.totalRevenue);
      console.log('Total Vouchers:', calculatedStats.totalVouchers);

      setStats(calculatedStats);
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
    fetchChartData(selectedChart);
  }, [selectedChart, fetchChartData]);


  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: <UserOutlined />,
      // change: '+12%',
      trend: 'up',
      key: 'users'
    },
    {
      title: 'Khóa học',
      value: stats.totalCourses,
      icon: <BookOutlined />,
      // change: '+5%',
      trend: 'up',
      key: 'courses'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarOutlined />,
      // change: '+18%',
      trend: 'up',
      key: 'totalRevenue'
    },
    {
      title: 'Voucher',
      value: stats.totalVouchers,
      icon: <GiftOutlined />,
      // change: '+3%',
      trend: 'up',
      key: 'vouchers'
    }
  ];

  const handleStatCardClick = (cardKey) => {
    setSelectedChart(cardKey);
  };

  const handleYearChange = (year) => {
    setChartYear(year);
    // Note: API should return data for the requested year
    // For now, we'll fetch data for the current selected chart
    fetchChartData(selectedChart);
  };

  const getChartTitle = () => {
    const titles = {
      users: 'Thống kê người dùng theo tháng',
      courses: 'Thống kê khóa học theo tháng',
      totalRevenue: 'Thống kê doanh thu theo tháng',
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
