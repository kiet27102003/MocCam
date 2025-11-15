import React, { useState, useEffect } from 'react';
import { 
  DollarOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import './PaymentManagement.css';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Vui lòng đăng nhập để truy cập trang này');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payments data:', data); // Debug log
        setPayments(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        setError(`Không thể tải danh sách thanh toán (${response.status})`);
      }
    } catch (err) {
      console.error('Error loading payments:', err);
      setError('Có lỗi xảy ra khi tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    try {
      const matchesSearch = 
        payment?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.payment_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.transaction_id?.toString().toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || payment?.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    } catch (err) {
      console.error('Error filtering payment:', err, payment);
      return false;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'success': { color: '#52c41a', label: 'Thành công', icon: <CheckCircleOutlined /> },
      'pending': { color: '#faad14', label: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
      'cancelled': { color: '#ff4d4f', label: 'Đã hủy', icon: <CloseCircleOutlined /> }
    };
    
    const config = statusConfig[status] || { color: '#8c8c8c', label: status, icon: <ExclamationCircleOutlined /> };
    
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.color }}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit'
    });
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  const getPaymentStats = () => {
    try {
      const total = payments.length;
      const success = payments.filter(p => p?.status === 'success').length;
      const pending = payments.filter(p => p?.status === 'pending').length;
      const cancelled = payments.filter(p => p?.status === 'cancelled').length;
      const totalAmount = payments
        .filter(p => p?.status === 'success')
        .reduce((sum, p) => sum + parseFloat(p?.final_amount ?? 0), 0);

      return { total, success, pending, cancelled, totalAmount };
    } catch (err) {
      console.error('Error calculating payment stats:', err);
      return { total: 0, success: 0, pending: 0, cancelled: 0, totalAmount: 0 };
    }
  };

  const stats = getPaymentStats();

  // Error boundary fallback
  if (error && !loading) {
    return (
      <div className="payment-management">
        <div className="error-container">
          <h2>Lỗi tải dữ liệu</h2>
          <p>{error}</p>
          <button onClick={loadPayments} className="retry-btn">
            <ReloadOutlined />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-management">
      <div className="payment-header">
        <div className="header-content">
          <h1>
            <DollarOutlined />
            Quản lý thanh toán
          </h1>
          <p>Quản lý và theo dõi các giao dịch thanh toán trong hệ thống</p>
        </div>
        <button 
          className="refresh-btn"
          onClick={loadPayments}
          disabled={loading}
        >
          <ReloadOutlined />
          Làm mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Payment Statistics */}
      <div className="payment-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <DollarOutlined />
          </div>
          <div className="stat-content">
            <h3>Tổng giao dịch</h3>
            <span className="stat-number">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircleOutlined />
          </div>
          <div className="stat-content">
            <h3>Thành công</h3>
            <span className="stat-number">{stats.success}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <ClockCircleOutlined />
          </div>
          <div className="stat-content">
            <h3>Chờ xử lý</h3>
            <span className="stat-number">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CloseCircleOutlined />
          </div>
          <div className="stat-content">
            <h3>Đã hủy</h3>
            <span className="stat-number">{stats.cancelled}</span>
          </div>
        </div>
        <div className="stat-card total-amount">
          <div className="stat-icon">
            <CreditCardOutlined />
          </div>
          <div className="stat-content">
            <h3>Tổng doanh thu</h3>
            <span className="stat-number">{formatCurrency(stats.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng, gói dịch vụ, payment ID hoặc transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FilterOutlined />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="pending">Chờ xử lý</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <div className="table-header">
          <h3>
            <CreditCardOutlined />
            Danh sách thanh toán ({filteredPayments.length})
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
          <div className="payments-table">
            {filteredPayments.length === 0 ? (
              <div className="empty-state">
                <CreditCardOutlined />
                <h3>Không tìm thấy giao dịch</h3>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            ) : (
              filteredPayments.map((payment) => {
                try {
                  return (
                    <div key={payment?.id || Math.random()} className="payment-card">
                      <div className="payment-info">
                        <div className="payment-header-info">
                          <div className="payment-id">
                            <CreditCardOutlined />
                            <span>#{payment?.payment_id || payment?.id || 'N/A'}</span>
                          </div>
                          {getStatusBadge(payment?.status)}
                        </div>
                        
                        <div className="payment-details">
                          <div className="detail-item">
                            <UserOutlined />
                            <div className="detail-content">
                              <label>Khách hàng</label>
                              <span>{payment?.user_name || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <CreditCardOutlined />
                            <div className="detail-content">
                              <label>Gói dịch vụ</label>
                              <span>{payment?.plan_name || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <CalendarOutlined />
                            <div className="detail-content">
                              <label>Ngày tạo</label>
                              <span>{formatDate(payment?.created_at)}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <DollarOutlined />
                            <div className="detail-content">
                              <label>Số tiền</label>
                              <span className="amount">{formatCurrency(payment?.final_amount || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="payment-actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewPayment(payment)}
                          title="Xem chi tiết"
                        >
                          <EyeOutlined />
                        </button>
                      </div>
                    </div>
                  );
                } catch (err) {
                  console.error('Error rendering payment card:', err, payment);
                  return null;
                }
              }).filter(Boolean)
            )}
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showPaymentDetail && selectedPayment && (
        <div className="modal-overlay">
          <div className="modal-content payment-detail-modal">
            <div className="modal-header">
              <h2>
                <CreditCardOutlined />
                Chi tiết giao dịch
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowPaymentDetail(false)}
              >
                ×
              </button>
            </div>
            
            <div className="payment-detail-content">
              <div className="payment-detail-header">
                <div className="payment-id-large">
                  <CreditCardOutlined />
                  <span>#{selectedPayment.payment_id || selectedPayment.id}</span>
                </div>
                {getStatusBadge(selectedPayment.status)}
              </div>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <UserOutlined />
                  <div>
                    <label>Khách hàng</label>
                    <span>{selectedPayment.user_name || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <CreditCardOutlined />
                  <div>
                    <label>Gói dịch vụ</label>
                    <span>{selectedPayment.plan_name || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <DollarOutlined />
                  <div>
                    <label>Số tiền gốc</label>
                    <span className="amount-large">{formatCurrency(selectedPayment.original_amount || 0)}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <DollarOutlined />
                  <div>
                    <label>Giảm giá</label>
                    <span className="amount-large">{formatCurrency(selectedPayment.discount_amount || 0)}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <DollarOutlined />
                  <div>
                    <label>Số tiền cuối</label>
                    <span className="amount-large">{formatCurrency(selectedPayment.final_amount || 0)}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <CalendarOutlined />
                  <div>
                    <label>Ngày tạo</label>
                    <span>{formatDate(selectedPayment.created_at)}</span>
                  </div>
                </div>
                
                {selectedPayment.transaction_id && (
                  <div className="detail-item">
                    <CreditCardOutlined />
                    <div>
                      <label>Transaction ID</label>
                      <span className="transaction-id">{selectedPayment.transaction_id}</span>
                    </div>
                  </div>
                )}
                
                {selectedPayment.payment_method && (
                  <div className="detail-item">
                    <CreditCardOutlined />
                    <div>
                      <label>Phương thức thanh toán</label>
                      <span>{selectedPayment.payment_method}</span>
                    </div>
                  </div>
                )}
                
                {selectedPayment.currency && (
                  <div className="detail-item">
                    <DollarOutlined />
                    <div>
                      <label>Tiền tệ</label>
                      <span>{selectedPayment.currency}</span>
                    </div>
                  </div>
                )}
                
                {selectedPayment.voucher_id && (
                  <div className="detail-item">
                    <CreditCardOutlined />
                    <div>
                      <label>Voucher ID</label>
                      <span>{selectedPayment.voucher_id}</span>
                    </div>
                  </div>
                )}
                
                {selectedPayment.description && (
                  <div className="detail-item full-width">
                    <ExclamationCircleOutlined />
                    <div>
                      <label>Mô tả</label>
                      <span>{selectedPayment.description}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="close-btn"
                onClick={() => setShowPaymentDetail(false)}
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

export default PaymentManagement;
