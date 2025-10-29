import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrownOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { userSubscriptionService } from '../../services/userSubscriptionService';
import './MySubscriptions.css';

const MySubscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      fetchMySubscriptions();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchMySubscriptions = async () => {
    try {
      setLoading(true);
      const response = await userSubscriptionService.getMySubscriptions();
      
      // Handle different response structures
      let subscriptionsData = [];
      
      if (Array.isArray(response)) {
        // API returns array directly
        subscriptionsData = response;
      } else if (response && Array.isArray(response.data)) {
        // API returns { data: [...] }
        subscriptionsData = response.data;
      } else if (response && response.data && Array.isArray(response.data.subscriptions)) {
        // API returns { data: { subscriptions: [...] } }
        subscriptionsData = response.data.subscriptions;
      } else if (response && typeof response === 'object') {
        // Single object, wrap in array
        subscriptionsData = [response];
      }
      
      setSubscriptions(subscriptionsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message || 'Không thể tải thông tin gói đăng ký');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (subscription) => {
    // Check if subscription has status field from API
    if (subscription.status === 'active') {
      return {
        status: 'active',
        label: 'Đang hoạt động',
        icon: <CheckCircleOutlined />,
        color: '#52c41a',
        bgColor: '#f6ffed',
        borderColor: '#b7eb8f'
      };
    } else if (subscription.status === 'expired' || subscription.status === 'cancelled') {
      return {
        status: 'expired',
        label: 'Đã hết hạn',
        icon: <CloseCircleOutlined />,
        color: '#ff4d4f',
        bgColor: '#fff1f0',
        borderColor: '#ffccc7'
      };
    }
    
    // Otherwise, calculate based on dates
    const now = new Date();
    const endDate = subscription.end_date ? new Date(subscription.end_date) : new Date();
    const startDate = subscription.start_date ? new Date(subscription.start_date) : new Date();
    
    if (endDate < now) {
      return {
        status: 'expired',
        label: 'Đã hết hạn',
        icon: <CloseCircleOutlined />,
        color: '#ff4d4f',
        bgColor: '#fff1f0',
        borderColor: '#ffccc7'
      };
    } else if (startDate > now) {
      return {
        status: 'upcoming',
        label: 'Sắp bắt đầu',
        icon: <ClockCircleOutlined />,
        color: '#faad14',
        bgColor: '#fffbe6',
        borderColor: '#ffe58f'
      };
    } else {
      return {
        status: 'active',
        label: 'Đang hoạt động',
        icon: <CheckCircleOutlined />,
        color: '#52c41a',
        bgColor: '#f6ffed',
        borderColor: '#b7eb8f'
      };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="my-subscriptions-page">
      <Header />
      
      <div className="my-subscriptions-container">
        <div className="my-subscriptions-content">
          <div className="page-header">
            <h1>
              <CrownOutlined />
              Quản lý gói đăng ký
            </h1>
            <p>Xem các gói đăng ký của bạn và trạng thái hạn sử dụng</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải thông tin...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <CloseCircleOutlined className="error-icon" />
              <p>{error}</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="empty-container">
              <CrownOutlined className="empty-icon" />
              <h3>Bạn chưa có gói đăng ký nào</h3>
              <p>Hãy nâng cấp để truy cập các tính năng cao cấp</p>
              <button 
                className="upgrade-button"
                onClick={() => navigate('/subscription')}
              >
                Xem các gói đăng ký
              </button>
            </div>
          ) : (
            <div className="subscriptions-grid">
              {subscriptions.map((subscription) => {
                const statusInfo = getStatusInfo(subscription);
                const daysRemaining = getDaysRemaining(subscription.end_date);
                
                return (
                  <div 
                    key={subscription.user_subscription_id || subscription.id} 
                    className={`subscription-card ${statusInfo.status}`}
                    style={{
                      borderColor: statusInfo.borderColor,
                      backgroundColor: statusInfo.bgColor
                    }}
                  >
                    <div className="subscription-header">
                      <div className="subscription-title">
                        <h3>{subscription.plan_name || 'Gói đăng ký'}</h3>
                        <div 
                          className="status-badge"
                          style={{ color: statusInfo.color }}
                        >
                          {statusInfo.icon}
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="subscription-body">
                      <div className="subscription-detail">
                        <label>Thời hạn:</label>
                        <span>
                          {subscription.start_date ? formatDate(subscription.start_date) : 'N/A'} - {subscription.end_date ? formatDate(subscription.end_date) : 'N/A'}
                        </span>
                      </div>

                      {statusInfo.status === 'active' && subscription.end_date && (
                        <div className="subscription-detail warning">
                          <label>Còn lại:</label>
                          <span className="days-remaining">
                            {daysRemaining} {daysRemaining === 1 ? 'ngày' : 'ngày'}
                          </span>
                        </div>
                      )}

                      <div className="subscription-detail">
                        <label>Họ tên:</label>
                        <span>{subscription.full_name || 'N/A'}</span>
                      </div>

                      <div className="subscription-detail">
                        <label>Trạng thái:</label>
                        <span style={{ color: statusInfo.color }}>
                          {subscription.status === 'active' ? 'Đang hoạt động' : 
                           subscription.status === 'expired' ? 'Đã hết hạn' :
                           subscription.status === 'cancelled' ? 'Đã hủy' : 'Không xác định'}
                        </span>
                      </div>

                      {statusInfo.status === 'active' && (
                        <div className="subscription-actions">
                          <button 
                            className="renew-button"
                            onClick={() => navigate('/subscription')}
                          >
                            Gia hạn gói
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MySubscriptions;

