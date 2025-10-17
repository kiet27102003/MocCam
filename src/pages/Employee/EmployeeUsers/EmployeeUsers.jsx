import React, { useState, useEffect } from 'react';
import { 
  UserOutlined, 
  SearchOutlined, 
  FilterOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BookOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import './EmployeeUsers.css';

const EmployeeUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: 'Nguyễn Thị Lan',
          email: 'lan.nguyen@email.com',
          phone: '0123456789',
          avatar: null,
          status: 'active',
          joinDate: '2024-01-15',
          courses: 3,
          completedLessons: 24,
          totalLessons: 36,
          rating: 4.8,
          lastActive: '2024-01-20',
          subscription: 'Premium',
          progress: 67
        },
        {
          id: 2,
          name: 'Trần Văn Minh',
          email: 'minh.tran@email.com',
          phone: '0987654321',
          avatar: null,
          status: 'active',
          joinDate: '2024-01-10',
          courses: 2,
          completedLessons: 18,
          totalLessons: 24,
          rating: 4.6,
          lastActive: '2024-01-19',
          subscription: 'Basic',
          progress: 75
        },
        {
          id: 3,
          name: 'Lê Thị Hoa',
          email: 'hoa.le@email.com',
          phone: '0369258147',
          avatar: null,
          status: 'inactive',
          joinDate: '2023-12-20',
          courses: 1,
          completedLessons: 8,
          totalLessons: 12,
          rating: 4.2,
          lastActive: '2024-01-05',
          subscription: 'Basic',
          progress: 67
        },
        {
          id: 4,
          name: 'Phạm Văn Đức',
          email: 'duc.pham@email.com',
          phone: '0741852963',
          avatar: null,
          status: 'active',
          joinDate: '2024-01-05',
          courses: 4,
          completedLessons: 32,
          totalLessons: 48,
          rating: 4.9,
          lastActive: '2024-01-20',
          subscription: 'Premium',
          progress: 67
        },
        {
          id: 5,
          name: 'Hoàng Thị Mai',
          email: 'mai.hoang@email.com',
          phone: '0851742963',
          avatar: null,
          status: 'pending',
          joinDate: '2024-01-18',
          courses: 0,
          completedLessons: 0,
          totalLessons: 0,
          rating: 0,
          lastActive: '2024-01-18',
          subscription: 'Trial',
          progress: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#059669';
      case 'inactive': return '#dc2626';
      case 'pending': return '#ea580c';
      case 'suspended': return '#6b7280';
      default: return '#666666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'pending': return 'Chờ xác nhận';
      case 'suspended': return 'Tạm khóa';
      default: return 'Không xác định';
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'Premium': return '#7c3aed';
      case 'Basic': return '#059669';
      case 'Trial': return '#ea580c';
      default: return '#6b7280';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  if (loading) {
    return (
      <div className="employee-users">
        <div className="users-header">
          <h1>Quản lý học viên</h1>
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
    <div className="employee-users">
      <div className="users-header">
        <div className="header-content">
          <h1>Quản lý học viên</h1>
          <p>Xem và quản lý thông tin học viên</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <TeamOutlined className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Tổng học viên</span>
            </div>
          </div>
          <div className="stat-item">
            <CheckCircleOutlined className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
              <span className="stat-label">Đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
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
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="suspended">Tạm khóa</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <UserOutlined className="avatar-icon" />
                )}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <div className="user-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  >
                    {getStatusText(user.status)}
                  </span>
                  <span 
                    className="subscription-badge"
                    style={{ backgroundColor: getSubscriptionColor(user.subscription) }}
                  >
                    {user.subscription}
                  </span>
                </div>
              </div>
              <button 
                className="view-btn"
                onClick={() => handleViewUser(user)}
                title="Xem chi tiết"
              >
                <EyeOutlined />
              </button>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <MailOutlined className="detail-icon" />
                <span className="detail-text">{user.email}</span>
              </div>
              <div className="detail-item">
                <PhoneOutlined className="detail-icon" />
                <span className="detail-text">{user.phone}</span>
              </div>
              <div className="detail-item">
                <CalendarOutlined className="detail-icon" />
                <span className="detail-text">Tham gia: {user.joinDate}</span>
              </div>
              <div className="detail-item">
                <ClockCircleOutlined className="detail-icon" />
                <span className="detail-text">Hoạt động cuối: {user.lastActive}</span>
              </div>
            </div>

            <div className="user-stats">
              <div className="stat-row">
                <div className="stat-item">
                  <BookOutlined className="stat-icon" />
                  <span className="stat-label">Khóa học:</span>
                  <span className="stat-value">{user.courses}</span>
                </div>
                <div className="stat-item">
                  <CheckCircleOutlined className="stat-icon" />
                  <span className="stat-label">Hoàn thành:</span>
                  <span className="stat-value">{user.completedLessons}/{user.totalLessons}</span>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <StarOutlined className="stat-icon" />
                  <span className="stat-label">Đánh giá:</span>
                  <span className="stat-value">{user.rating > 0 ? user.rating : 'Chưa có'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tiến độ:</span>
                  <span className="stat-value">{user.progress}%</span>
                </div>
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${user.progress}%`,
                  backgroundColor: getStatusColor(user.status)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">
          <UserOutlined className="no-users-icon" />
          <h3>Không tìm thấy học viên</h3>
          <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết học viên</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-info">
                <div className="detail-section">
                  <h3>Thông tin cá nhân</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Họ tên:</span>
                      <span className="detail-value">{selectedUser.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedUser.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Số điện thoại:</span>
                      <span className="detail-value">{selectedUser.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ngày tham gia:</span>
                      <span className="detail-value">{selectedUser.joinDate}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Thống kê học tập</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Số khóa học:</span>
                      <span className="detail-value">{selectedUser.courses}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bài học hoàn thành:</span>
                      <span className="detail-value">{selectedUser.completedLessons}/{selectedUser.totalLessons}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Đánh giá:</span>
                      <span className="detail-value">{selectedUser.rating > 0 ? selectedUser.rating : 'Chưa có'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tiến độ:</span>
                      <span className="detail-value">{selectedUser.progress}%</span>
                    </div>
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

export default EmployeeUsers;
