import React, { useState, useEffect } from 'react';
import { 
  BarChartOutlined, 
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  CalendarOutlined,
  FilterOutlined,
  EyeOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './EmployeeReports.css';

const EmployeeReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: 'Báo cáo học viên',
          description: 'Thống kê về số lượng và hoạt động của học viên',
          type: 'students',
          icon: <UserOutlined />,
          color: '#4f46e5',
          data: {
            totalStudents: 156,
            activeStudents: 89,
            newStudents: 12,
            inactiveStudents: 55,
            completionRate: 78,
            satisfactionRate: 4.8
          },
          lastUpdated: '2024-01-20',
          period: 'Tháng 1/2024'
        },
        {
          id: 2,
          title: 'Báo cáo khóa học',
          description: 'Thống kê về các khóa học và tiến độ học tập',
          type: 'courses',
          icon: <BookOutlined />,
          color: '#059669',
          data: {
            totalCourses: 8,
            activeCourses: 6,
            completedCourses: 2,
            totalLessons: 234,
            completedLessons: 189,
            averageProgress: 81
          },
          lastUpdated: '2024-01-20',
          period: 'Tháng 1/2024'
        },
        {
          id: 3,
          title: 'Báo cáo doanh thu',
          description: 'Thống kê về doanh thu và thanh toán',
          type: 'revenue',
          icon: <DollarOutlined />,
          color: '#dc2626',
          data: {
            totalRevenue: 45000000,
            monthlyRevenue: 15000000,
            averageRevenue: 5000000,
            paymentSuccess: 95,
            refundRate: 2,
            growthRate: 12
          },
          lastUpdated: '2024-01-20',
          period: 'Tháng 1/2024'
        },
        {
          id: 4,
          title: 'Báo cáo đánh giá',
          description: 'Thống kê về đánh giá và phản hồi của học viên',
          type: 'ratings',
          icon: <StarOutlined />,
          color: '#ea580c',
          data: {
            averageRating: 4.8,
            totalRatings: 89,
            fiveStar: 65,
            fourStar: 18,
            threeStar: 4,
            twoStar: 1,
            oneStar: 1
          },
          lastUpdated: '2024-01-20',
          period: 'Tháng 1/2024'
        },
        {
          id: 5,
          title: 'Báo cáo thời gian',
          description: 'Thống kê về thời gian học tập và hoạt động',
          type: 'time',
          icon: <ClockCircleOutlined />,
          color: '#7c3aed',
          data: {
            totalStudyTime: 1240,
            averageSessionTime: 45,
            peakHours: '19:00-21:00',
            weekendActivity: 35,
            mobileUsage: 68,
            desktopUsage: 32
          },
          lastUpdated: '2024-01-20',
          period: 'Tháng 1/2024'
        },
        {
          id: 6,
          title: 'Báo cáo tổng hợp',
          description: 'Báo cáo tổng hợp tất cả các chỉ số quan trọng',
          type: 'summary',
          icon: <BarChartOutlined />,
          color: '#0891b2',
          data: {
            overallPerformance: 87,
            studentGrowth: 15,
            courseCompletion: 78,
            revenueGrowth: 12,
            satisfactionScore: 4.8,
            systemUptime: 99.5
          },
          lastUpdated: '2024-01-20',
          period: 'Tháng 1/2024'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report) => {
    // Simulate download
    console.log('Downloading report:', report.title);
  };


  const getChartType = (type) => {
    switch (type) {
      case 'students': return <PieChartOutlined />;
      case 'courses': return <BarChartOutlined />;
      case 'revenue': return <LineChartOutlined />;
      case 'ratings': return <PieChartOutlined />;
      case 'time': return <LineChartOutlined />;
      case 'summary': return <BarChartOutlined />;
      default: return <BarChartOutlined />;
    }
  };

  if (loading) {
    return (
      <div className="employee-reports">
        <div className="reports-header">
          <h1>Báo cáo và thống kê</h1>
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
    <div className="employee-reports">
      <div className="reports-header">
        <div className="header-content">
          <h1>Báo cáo và thống kê</h1>
          <p>Xem và phân tích các báo cáo chi tiết về hoạt động giảng dạy</p>
        </div>
        <div className="header-controls">
          <div className="period-selector">
            <CalendarOutlined className="calendar-icon" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <div className="report-icon" style={{ backgroundColor: report.color }}>
                {report.icon}
              </div>
              <div className="report-info">
                <h3 className="report-title">{report.title}</h3>
                <p className="report-description">{report.description}</p>
                <div className="report-meta">
                  <span className="report-period">{report.period}</span>
                  <span className="report-updated">Cập nhật: {report.lastUpdated}</span>
                </div>
              </div>
              <div className="report-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewReport(report)}
                  title="Xem chi tiết"
                >
                  <EyeOutlined />
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={() => handleDownloadReport(report)}
                  title="Tải xuống"
                >
                  <DownloadOutlined />
                </button>
              </div>
            </div>

            <div className="report-preview">
              <div className="chart-placeholder">
                {getChartType(report.type)}
                <span>Biểu đồ {report.title.toLowerCase()}</span>
              </div>
              
              <div className="key-metrics">
                {Object.entries(report.data).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="metric-item">
                    <span className="metric-label">
                      {key === 'totalStudents' && 'Tổng học viên'}
                      {key === 'activeStudents' && 'Đang hoạt động'}
                      {key === 'totalCourses' && 'Tổng khóa học'}
                      {key === 'activeCourses' && 'Đang hoạt động'}
                      {key === 'totalRevenue' && 'Tổng doanh thu'}
                      {key === 'monthlyRevenue' && 'Doanh thu tháng'}
                      {key === 'averageRating' && 'Đánh giá TB'}
                      {key === 'totalRatings' && 'Tổng đánh giá'}
                      {key === 'totalStudyTime' && 'Thời gian học'}
                      {key === 'averageSessionTime' && 'Phiên TB'}
                      {key === 'overallPerformance' && 'Hiệu suất'}
                      {key === 'studentGrowth' && 'Tăng trưởng'}
                    </span>
                    <span className="metric-value">
                      {key.includes('Revenue') ? formatCurrency(value) :
                       key.includes('Time') ? formatTime(value) :
                       key.includes('Rate') || key.includes('Rating') ? `${value}/5` :
                       key.includes('Growth') || key.includes('Performance') ? `${value}%` :
                       value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="title-icon" style={{ backgroundColor: selectedReport.color }}>
                  {selectedReport.icon}
                </div>
                <div>
                  <h2>{selectedReport.title}</h2>
                  <p>{selectedReport.description}</p>
                </div>
              </div>
              <button 
                className="close-btn"
                onClick={() => setSelectedReport(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="report-details">
                <div className="chart-section">
                  <h3>Biểu đồ</h3>
                  <div className="chart-container">
                    <div className="chart-placeholder-large">
                      {getChartType(selectedReport.type)}
                      <span>Biểu đồ chi tiết {selectedReport.title.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="metrics-section">
                  <h3>Chỉ số chi tiết</h3>
                  <div className="metrics-grid">
                    {Object.entries(selectedReport.data).map(([key, value]) => (
                      <div key={key} className="metric-card">
                        <div className="metric-header">
                          <span className="metric-label">
                            {key === 'totalStudents' && 'Tổng học viên'}
                            {key === 'activeStudents' && 'Học viên hoạt động'}
                            {key === 'newStudents' && 'Học viên mới'}
                            {key === 'inactiveStudents' && 'Học viên không hoạt động'}
                            {key === 'completionRate' && 'Tỷ lệ hoàn thành'}
                            {key === 'satisfactionRate' && 'Tỷ lệ hài lòng'}
                            {key === 'totalCourses' && 'Tổng khóa học'}
                            {key === 'activeCourses' && 'Khóa học hoạt động'}
                            {key === 'completedCourses' && 'Khóa học hoàn thành'}
                            {key === 'totalLessons' && 'Tổng bài học'}
                            {key === 'completedLessons' && 'Bài học hoàn thành'}
                            {key === 'averageProgress' && 'Tiến độ trung bình'}
                            {key === 'totalRevenue' && 'Tổng doanh thu'}
                            {key === 'monthlyRevenue' && 'Doanh thu tháng'}
                            {key === 'averageRevenue' && 'Doanh thu trung bình'}
                            {key === 'paymentSuccess' && 'Tỷ lệ thanh toán thành công'}
                            {key === 'refundRate' && 'Tỷ lệ hoàn tiền'}
                            {key === 'growthRate' && 'Tỷ lệ tăng trưởng'}
                            {key === 'averageRating' && 'Đánh giá trung bình'}
                            {key === 'totalRatings' && 'Tổng đánh giá'}
                            {key === 'fiveStar' && '5 sao'}
                            {key === 'fourStar' && '4 sao'}
                            {key === 'threeStar' && '3 sao'}
                            {key === 'twoStar' && '2 sao'}
                            {key === 'oneStar' && '1 sao'}
                            {key === 'totalStudyTime' && 'Tổng thời gian học'}
                            {key === 'averageSessionTime' && 'Thời gian phiên trung bình'}
                            {key === 'peakHours' && 'Giờ cao điểm'}
                            {key === 'weekendActivity' && 'Hoạt động cuối tuần'}
                            {key === 'mobileUsage' && 'Sử dụng mobile'}
                            {key === 'desktopUsage' && 'Sử dụng desktop'}
                            {key === 'overallPerformance' && 'Hiệu suất tổng thể'}
                            {key === 'studentGrowth' && 'Tăng trưởng học viên'}
                            {key === 'courseCompletion' && 'Hoàn thành khóa học'}
                            {key === 'revenueGrowth' && 'Tăng trưởng doanh thu'}
                            {key === 'satisfactionScore' && 'Điểm hài lòng'}
                            {key === 'systemUptime' && 'Thời gian hoạt động hệ thống'}
                          </span>
                        </div>
                        <div className="metric-value">
                          {key.includes('Revenue') ? formatCurrency(value) :
                           key.includes('Time') ? formatTime(value) :
                           key.includes('Rate') || key.includes('Rating') || key.includes('Score') ? `${value}/5` :
                           key.includes('Growth') || key.includes('Performance') || key.includes('Uptime') ? `${value}%` :
                           value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeReports;
