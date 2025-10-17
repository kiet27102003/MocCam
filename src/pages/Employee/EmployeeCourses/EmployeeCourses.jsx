import React, { useState, useEffect } from 'react';
import { 
  BookOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import './EmployeeCourses.css';

const EmployeeCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCourses([
        {
          id: 1,
          title: 'Đàn Tranh Cơ Bản',
          description: 'Khóa học cơ bản về đàn tranh cho người mới bắt đầu',
          instructor: 'Nguyễn Văn A',
          students: 45,
          duration: '8 tuần',
          status: 'active',
          rating: 4.8,
          price: 500000,
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          lessons: 24,
          completedLessons: 18
        },
        {
          id: 2,
          title: 'Đàn Tranh Nâng Cao',
          description: 'Khóa học nâng cao về kỹ thuật đàn tranh',
          instructor: 'Trần Thị B',
          students: 32,
          duration: '12 tuần',
          status: 'active',
          rating: 4.9,
          price: 800000,
          startDate: '2024-02-01',
          endDate: '2024-04-30',
          lessons: 36,
          completedLessons: 12
        },
        {
          id: 3,
          title: 'Kỹ thuật Ngón Tay',
          description: 'Chuyên sâu về kỹ thuật ngón tay trong đàn tranh',
          instructor: 'Lê Văn C',
          students: 28,
          duration: '6 tuần',
          status: 'draft',
          rating: 0,
          price: 400000,
          startDate: '2024-03-01',
          endDate: '2024-04-15',
          lessons: 18,
          completedLessons: 5
        },
        {
          id: 4,
          title: 'Nhạc Cổ Điển Việt Nam',
          description: 'Tìm hiểu về nhạc cổ điển Việt Nam qua đàn tranh',
          instructor: 'Phạm Thị D',
          students: 38,
          duration: '10 tuần',
          status: 'completed',
          rating: 4.7,
          price: 600000,
          startDate: '2023-11-01',
          endDate: '2024-01-15',
          lessons: 30,
          completedLessons: 30
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#059669';
      case 'draft': return '#ea580c';
      case 'completed': return '#4f46e5';
      case 'paused': return '#dc2626';
      default: return '#666666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'draft': return 'Bản nháp';
      case 'completed': return 'Hoàn thành';
      case 'paused': return 'Tạm dừng';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="employee-courses">
        <div className="courses-header">
          <h1>Quản lý khóa học</h1>
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
    <div className="employee-courses">
      <div className="courses-header">
        <div className="header-content">
          <h1>Quản lý khóa học</h1>
          <p>Quản lý và theo dõi các khóa học của bạn</p>
        </div>
        <button className="add-course-btn">
          <PlusOutlined />
          <span>Tạo khóa học mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-dropdown">
          <FilterOutlined className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="draft">Bản nháp</option>
            <option value="completed">Hoàn thành</option>
            <option value="paused">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <div className="course-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(course.status) }}
                >
                  {getStatusText(course.status)}
                </span>
              </div>
              <div className="course-actions">
                <button className="action-btn view-btn" title="Xem chi tiết">
                  <EyeOutlined />
                </button>
                <button className="action-btn edit-btn" title="Chỉnh sửa">
                  <EditOutlined />
                </button>
                <button className="action-btn delete-btn" title="Xóa">
                  <DeleteOutlined />
                </button>
              </div>
            </div>

            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              
              <div className="course-info">
                <div className="info-item">
                  <UserOutlined className="info-icon" />
                  <span>{course.instructor}</span>
                </div>
                <div className="info-item">
                  <UserOutlined className="info-icon" />
                  <span>{course.students} học viên</span>
                </div>
                <div className="info-item">
                  <ClockCircleOutlined className="info-icon" />
                  <span>{course.duration}</span>
                </div>
                <div className="info-item">
                  <CalendarOutlined className="info-icon" />
                  <span>{course.startDate} - {course.endDate}</span>
                </div>
              </div>

              <div className="course-stats">
                <div className="stat-item">
                  <span className="stat-label">Bài học:</span>
                  <span className="stat-value">{course.completedLessons}/{course.lessons}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Đánh giá:</span>
                  <div className="rating">
                    <StarOutlined className="star-icon" />
                    <span>{course.rating > 0 ? course.rating : 'Chưa có'}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Giá:</span>
                  <span className="stat-value price">{formatCurrency(course.price)}</span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(course.completedLessons / course.lessons) * 100}%`,
                    backgroundColor: getStatusColor(course.status)
                  }}
                ></div>
              </div>
              <div className="progress-text">
                Tiến độ: {Math.round((course.completedLessons / course.lessons) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-courses">
          <BookOutlined className="no-courses-icon" />
          <h3>Không tìm thấy khóa học</h3>
          <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeCourses;
