import React, { useState, useEffect } from "react";
import {
  EyeOutlined,
  StopOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { userSubscriptionService } from "../../../services/userSubscriptionService";
import "./UserSubscriptionManagement.css";

const UserSubscriptionManagement = () => {
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadUserSubscriptions();
  }, []);

  const loadUserSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userSubscriptionService.getAllUserSubscriptions();
      setUserSubscriptions(data);
    } catch (err) {
      if (err.message.includes('401')) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (err.message.includes('500')) {
        setError("Lỗi máy chủ khi tải danh sách gói đăng ký người dùng.");
      } else {
        setError("Không thể tải danh sách gói đăng ký người dùng");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (subscription) => {
    try {
      setLoading(true);
      const details = await userSubscriptionService.getUserSubscriptionById(subscription.user_subscription_id);
      setSelectedSubscription(details);
      setIsDetailModalOpen(true);
    } catch (err) {
      if (err.message.includes('404')) {
        setError("Không tìm thấy chi tiết gói đăng ký.");
      } else if (err.message.includes('403')) {
        setError("Bạn không có quyền xem chi tiết gói đăng ký này.");
      } else {
        setError("Không thể tải chi tiết gói đăng ký.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscription) => {
    if (!window.confirm("Bạn có chắc muốn hủy gói đăng ký này?")) return;
    
    try {
      setLoading(true);
      setError("");
      await userSubscriptionService.cancelUserSubscription(subscription.user_subscription_id);
      setSuccess("Hủy gói đăng ký thành công!");
      loadUserSubscriptions();
    } catch (err) {
      if (err.message.includes('400')) {
        setError("Không thể hủy gói đăng ký không ở trạng thái active.");
      } else if (err.message.includes('403')) {
        setError("Bạn không có quyền hủy gói đăng ký này.");
      } else if (err.message.includes('404')) {
        setError("Không tìm thấy gói đăng ký để hủy.");
      } else {
        setError("Không thể hủy gói đăng ký.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    `${Number(price).toLocaleString("vi-VN")} VND`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { 
          text: 'Đang hoạt động', 
          color: '#52c41a', 
          icon: <CheckCircleOutlined /> 
        };
      case 'canceled':
        return { 
          text: 'Đã hủy', 
          color: '#ff4d4f', 
          icon: <CloseCircleOutlined /> 
        };
      case 'expired':
        return { 
          text: 'Đã hết hạn', 
          color: '#faad14', 
          icon: <ClockCircleOutlined /> 
        };
      default:
        return { 
          text: status, 
          color: '#8c8c8c', 
          icon: <ClockCircleOutlined /> 
        };
    }
  };

  const getSubscriptionStats = () => {
    const total = userSubscriptions.length;
    const active = userSubscriptions.filter(s => s.status === 'active').length;
    const canceled = userSubscriptions.filter(s => s.status === 'canceled').length;
    const expired = userSubscriptions.filter(s => s.status === 'expired').length;
    
    return { total, active, canceled, expired };
  };

  const stats = getSubscriptionStats();

  return (
    <div className="user-subscription-management">
      <div className="subscription-header">
        <h1>Quản lý Gói Đăng Ký Người Dùng</h1>
        <button className="refresh-btn" onClick={loadUserSubscriptions}>
          🔄 Làm mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="subscription-stats">
        <div className="stat-card">
          <h3>Tổng gói</h3>
          <span className="stat-number">{stats.total}</span>
        </div>
        <div className="stat-card active">
          <h3>Đang hoạt động</h3>
          <span className="stat-number">{stats.active}</span>
        </div>
        <div className="stat-card canceled">
          <h3>Đã hủy</h3>
          <span className="stat-number">{stats.canceled}</span>
        </div>
        <div className="stat-card expired">
          <h3>Đã hết hạn</h3>
          <span className="stat-number">{stats.expired}</span>
        </div>
      </div>

      <div className="subscription-table-container">
        <table className="subscription-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Tên gói</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">Đang tải...</td>
              </tr>
            ) : userSubscriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">Chưa có gói đăng ký nào</td>
              </tr>
            ) : (
              userSubscriptions.map(subscription => {
                const statusInfo = getStatusInfo(subscription.status);
                
                return (
                  <tr key={subscription.user_subscription_id}>
                    <td className="user-name">
                      <UserOutlined /> {subscription.full_name}
                    </td>
                    <td className="plan-name">{subscription.plan_name}</td>
                    <td className="start-date">
                      <CalendarOutlined /> {formatDate(subscription.start_date)}
                    </td>
                    <td className="end-date">
                      <CalendarOutlined /> {formatDate(subscription.end_date)}
                    </td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewDetails(subscription)}
                          title="Xem chi tiết"
                        >
                          <EyeOutlined />
                        </button>
                        {subscription.status === 'active' && (
                          <button
                            className="action-btn cancel-btn"
                            onClick={() => handleCancelSubscription(subscription)}
                            title="Hủy gói đăng ký"
                          >
                            <StopOutlined />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedSubscription && (
        <div className="modal-overlay">
          <div className="modal-content detail-modal">
            <div className="modal-header">
              <h2>
                <EyeOutlined />
                Chi tiết gói đăng ký
              </h2>
              <button
                className="close-btn"
                onClick={() => setIsDetailModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="detail-content">
              <div className="detail-section">
                <h3>Thông tin người dùng</h3>
                <div className="detail-item">
                  <label>Tên người dùng:</label>
                  <span>{selectedSubscription.full_name}</span>
                </div>
                <div className="detail-item">
                  <label>ID người dùng:</label>
                  <span>{selectedSubscription.user_id}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin gói đăng ký</h3>
                <div className="detail-item">
                  <label>Tên gói:</label>
                  <span>{selectedSubscription.plan_name}</span>
                </div>
                <div className="detail-item">
                  <label>ID gói:</label>
                  <span>{selectedSubscription.plan_id}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày bắt đầu:</label>
                  <span>{formatDate(selectedSubscription.start_date)}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày kết thúc:</label>
                  <span>{formatDate(selectedSubscription.end_date)}</span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái:</label>
                  <span className="status-badge" style={{ backgroundColor: getStatusInfo(selectedSubscription.status).color }}>
                    {getStatusInfo(selectedSubscription.status).icon} {getStatusInfo(selectedSubscription.status).text}
                  </span>
                </div>
                <div className="detail-item">
                  <label>ID đăng ký:</label>
                  <span>{selectedSubscription.user_subscription_id}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày tạo:</label>
                  <span>{formatDate(selectedSubscription.created_at || selectedSubscription.start_date)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsDetailModalOpen(false)}
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

export default UserSubscriptionManagement;
