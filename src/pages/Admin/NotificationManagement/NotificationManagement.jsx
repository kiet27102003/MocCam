import React, { useState, useEffect } from 'react';
import { 
  BellOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { notificationService } from '../../../services/notificationService';
import './NotificationManagement.css';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    message: '',
    type: 'system'
  });

  useEffect(() => {
    loadNotifications();
    loadUsers();
  }, []);

  const loadNotifications = async () => {
    console.log('📥 [LOAD] Bắt đầu tải danh sách thông báo...');
    try {
      setLoading(true);
      setError('');
      console.log('📤 [LOAD] Gọi API getNotifications...');
      const data = await notificationService.getNotifications();
      console.log('📥 [LOAD] API response:', data);
      
      const notificationsArray = Array.isArray(data) ? data : [];
      console.log('📊 [LOAD] Số lượng thông báo:', notificationsArray.length);
      setNotifications(notificationsArray);
      
      console.log('✅ [LOAD] Tải danh sách thông báo thành công');
    } catch (err) {
      console.error('❌ [LOAD] Lỗi khi tải danh sách thông báo:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await notificationService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading users:', err);
      // Không hiển thị lỗi cho users vì không bắt buộc
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    try {
      const matchesSearch = 
        notification?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification?.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification?.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || notification?.type === filterType;
      
      return matchesSearch && matchesType;
    } catch (err) {
      console.error('Error filtering notification:', err, notification);
      return false;
    }
  });

  const getTypeBadge = (type) => {
    const typeConfig = {
      'system': { color: '#1890ff', label: 'Hệ thống', icon: <InfoCircleOutlined /> },
      'announcement': { color: '#52c41a', label: 'Thông báo', icon: <BellOutlined /> },
      'warning': { color: '#faad14', label: 'Cảnh báo', icon: <ExclamationCircleOutlined /> },
      'error': { color: '#ff4d4f', label: 'Lỗi', icon: <CloseCircleOutlined /> },
      'success': { color: '#52c41a', label: 'Thành công', icon: <CheckCircleOutlined /> }
    };
    
    const config = typeConfig[type] || { color: '#8c8c8c', label: type, icon: <MessageOutlined /> };
    
    return (
      <span 
        className="type-badge"
        style={{ backgroundColor: config.color }}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submitted with data:', formData);
    
    // Ensure we're sending the correct user_id
    const submitData = { ...formData };
    console.log('🔄 Form data user_id:', formData.user_id);
    console.log('🔄 Form data type:', typeof formData.user_id);
    
    if (formData.user_id && formData.user_id !== '') {
      console.log('✅ Sending notification to specific user_id:', formData.user_id);
    } else {
      console.log('✅ Sending notification to all users (user_id is empty)');
    }
    
    console.log('📤 Final data to be sent:', submitData);
    
    try {
      setLoading(true);
      console.log('🟡 Creating notification...');
      const result = await notificationService.createNotification(submitData);
      console.log('✅ Notification created successfully:', result);
      
      setShowCreateForm(false);
      const resetFormData = {
        user_id: '',
        title: '',
        message: '',
        type: 'system'
      };
      console.log('🔄 Resetting form data:', resetFormData);
      setFormData(resetFormData);
      
      console.log('🔄 Reloading notifications...');
      loadNotifications();
      alert('Tạo thông báo thành công!');
    } catch (err) {
      console.error('❌ Error creating notification:', err);
      alert(err.message || 'Có lỗi xảy ra khi tạo thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
  };

  const handleDeleteNotification = async (notification_id) => {
    console.log('🗑️ [DELETE] Bắt đầu xóa thông báo:', {
      notification_Id: notification_id,
      timestamp: new Date().toISOString()
    });

    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      console.log('✅ [DELETE] User xác nhận xóa thông báo');
      
      try {
        console.log('📤 [DELETE] Gọi API xóa thông báo...');
        const result = await notificationService.deleteNotification(notification_id);
        console.log('📥 [DELETE] API response:', result);

        console.log('🔄 [DELETE] Tải lại danh sách thông báo...');
        await loadNotifications();
        
        console.log('✅ [DELETE] Xóa thông báo thành công!');
        alert('Xóa thông báo thành công!');
      } catch (err) {
        console.error('❌ [DELETE] Lỗi khi xóa thông báo:', {
          error: err,
          notificationId: notification_id,
          timestamp: new Date().toISOString()
        });
        alert(err.message || 'Có lỗi xảy ra khi xóa thông báo');
      }
    } else {
      console.log('❌ [DELETE] User hủy bỏ xóa thông báo');
    }
  };

  const getNotificationStats = () => {
    try {
      const total = notifications.length;
      const system = notifications.filter(n => n?.type === 'system').length;
      const announcement = notifications.filter(n => n?.type === 'announcement').length;
      const warning = notifications.filter(n => n?.type === 'warning').length;
      const error = notifications.filter(n => n?.type === 'error').length;

      return { total, system, announcement, warning, error };
    } catch (err) {
      console.error('Error calculating notification stats:', err);
      return { total: 0, system: 0, announcement: 0, warning: 0, error: 0 };
    }
  };

  const stats = getNotificationStats();

  if (error && !loading) {
    return (
      <div className="notification-management">
        <div className="error-container">
          <h2>Lỗi tải dữ liệu</h2>
          <p>{error}</p>
          <button onClick={loadNotifications} className="retry-btn">
            <ReloadOutlined />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-management">
      <div className="notification-header">
        <div className="header-content">
          <h1>
            <BellOutlined />
            Quản lý thông báo
          </h1>
          <p>Quản lý và gửi thông báo đến người dùng trong hệ thống</p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={loadNotifications}
            disabled={loading}
          >
            <ReloadOutlined />
            Làm mới
          </button>
          <button 
            className="create-btn"
            onClick={() => {
              console.log('➕ Create notification button clicked');
              setShowCreateForm(true);
            }}
          >
            <PlusOutlined />
            Tạo thông báo
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Notification Statistics */}
      <div className="notification-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <BellOutlined />
          </div>
          <div className="stat-content">
            <h3>Tổng thông báo</h3>
            <span className="stat-number">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <InfoCircleOutlined />
          </div>
          <div className="stat-content">
            <h3>Hệ thống</h3>
            <span className="stat-number">{stats.system}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <BellOutlined />
          </div>
          <div className="stat-content">
            <h3>Thông báo</h3>
            <span className="stat-number">{stats.announcement}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <ExclamationCircleOutlined />
          </div>
          <div className="stat-content">
            <h3>Cảnh báo</h3>
            <span className="stat-number">{stats.warning}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CloseCircleOutlined />
          </div>
          <div className="stat-content">
            <h3>Lỗi</h3>
            <span className="stat-number">{stats.error}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FilterOutlined />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="system">Hệ thống</option>
            <option value="announcement">Thông báo</option>
            <option value="warning">Cảnh báo</option>
            <option value="error">Lỗi</option>
            <option value="success">Thành công</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="notifications-table-container">
        <div className="table-header">
          <h3>
            <MessageOutlined />
            Danh sách thông báo ({filteredNotifications.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <div className="notifications-table">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <BellOutlined />
                <h3>Không tìm thấy thông báo</h3>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                try {
                  return (
                    <div key={notification?.id || Math.random()} className="notification-card">
                      <div className="notification-info">
                        <div className="notification-header-info">
                          <div className="notification-title">
                            <BellOutlined />
                            <span>{notification?.title || 'N/A'}</span>
                          </div>
                          {getTypeBadge(notification?.type)}
                        </div>
                        
                        <div className="notification-details">
                          <div className="detail-item">
                            <UserOutlined />
                            <div className="detail-content">
                              <label>Người nhận</label>
                              <span>{notification?.user_name || 'Tất cả người dùng'}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <CalendarOutlined />
                            <div className="detail-content">
                              <label>Ngày tạo</label>
                              <span>{formatDate(notification?.created_at)}</span>
                            </div>
                          </div>
                          <div className="detail-item message-preview">
                            <MessageOutlined />
                            <div className="detail-content">
                              <label>Nội dung</label>
                              <span>{notification?.message ? 
                                (notification.message.length > 100 ? 
                                  notification.message.substring(0, 100) + '...' : 
                                  notification.message) : 'N/A'
                              }</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="notification-actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewNotification(notification)}
                          title="Xem chi tiết"
                        >
                          <EyeOutlined />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteNotification(notification.notification_id || notification.id)}
                          title="Xóa thông báo"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </div>
                  );
                } catch (err) {
                  console.error('Error rendering notification card:', err, notification);
                  return null;
                }
              }).filter(Boolean)
            )}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content create-notification-modal">
            <div className="modal-header">
              <h2>
                <PlusOutlined />
                Tạo thông báo mới
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="notification-form">
              <div className="form-group">
                <label htmlFor="user_id">Người nhận</label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                >
                  <option value="">Tất cả người dùng</option>
                  {users.map(user => {
                    console.log('👤 User data:', user);
                    return (
                      <option key={user.id || user.user_id} value={user.id || user.user_id}>
                        {user.name || user.username || user.email} (ID: {user.id || user.user_id})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại thông báo</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="system">Hệ thống</option>
                  <option value="announcement">Thông báo</option>
                  <option value="warning">Cảnh báo</option>
                  <option value="error">Lỗi</option>
                  <option value="success">Thành công</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Tiêu đề *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề thông báo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội dung *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung thông báo"
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  <SendOutlined />
                  {loading ? 'Đang gửi...' : 'Gửi thông báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {showNotificationDetail && selectedNotification && (
        <div className="modal-overlay">
          <div className="modal-content notification-detail-modal">
            <div className="modal-header">
              <h2>
                <BellOutlined />
                Chi tiết thông báo
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowNotificationDetail(false)}
              >
                ×
              </button>
            </div>
            
            <div className="notification-detail-content">
              <div className="notification-detail-header">
                <div className="notification-title-large">
                  <BellOutlined />
                  <span>{selectedNotification.title}</span>
                </div>
                {getTypeBadge(selectedNotification.type)}
              </div>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <UserOutlined />
                  <div>
                    <label>Người nhận</label>
                    <span>{selectedNotification.user_name || 'Tất cả người dùng'}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <CalendarOutlined />
                  <div>
                    <label>Ngày tạo</label>
                    <span>{formatDate(selectedNotification.created_at)}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <MessageOutlined />
                  <div>
                    <label>Loại thông báo</label>
                    <span>{selectedNotification.type}</span>
                  </div>
                </div>
                
                <div className="detail-item full-width">
                  <MessageOutlined />
                  <div>
                    <label>Nội dung</label>
                    <div className="message-content">
                      {selectedNotification.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="close-btn"
                onClick={() => setShowNotificationDetail(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
