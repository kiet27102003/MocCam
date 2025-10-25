import React, { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import axios from 'axios';
import './VoucherManagement.css';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    discount_value: '',
    max_usage: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/vouchers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Log chi tiết API response
      console.log('=== VOUCHER API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Log từng voucher để xem structure
      if (response.data && Array.isArray(response.data)) {
        console.log('Number of vouchers:', response.data.length);
        response.data.forEach((voucher, index) => {
          console.log(`Voucher ${index + 1}:`, {
            voucher_id: voucher.voucher_id,
            code: voucher.code,
            description: voucher.description,
            discount_value: voucher.discount_value,
            max_usage: voucher.max_usage,
            used_count: voucher.used_count,
            start_date: voucher.start_date,
            end_date: voucher.end_date,
            created_at: voucher.created_at,
            updated_at: voucher.updated_at,
            // Log tất cả keys để xem có field nào khác không
            all_keys: Object.keys(voucher)
          });
        });
      } else {
        console.log('Response data is not an array:', typeof response.data);
      }
      console.log('=== END VOUCHER API RESPONSE ===');
      
      setVouchers(response.data);
    } catch (err) {
      console.error('Error loading vouchers:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      if (!formData.description || !formData.discount_value || !formData.max_usage || !formData.start_date || !formData.end_date) {
        setError('Vui lòng điền đầy đủ thông tin');
        setLoading(false);
        return;
      }

      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        setError('Ngày kết thúc phải sau ngày bắt đầu');
        setLoading(false);
        return;
      }

      const discountValue = parseInt(formData.discount_value);
      if (discountValue <= 0) {
        setError('Giá trị giảm phải lớn hơn 0 VNĐ');
        setLoading(false);
        return;
      }

      const maxUsage = parseInt(formData.max_usage);
      if (maxUsage <= 0) {
        setError('Số lần sử dụng tối đa phải lớn hơn 0');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/vouchers/create', {
        description: formData.description,
        discount_value: discountValue,
        max_usage: maxUsage,
        start_date: formData.start_date,
        end_date: formData.end_date
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Log chi tiết response khi tạo voucher
      console.log('=== CREATE VOUCHER API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Created voucher with ID:', response.data.voucher_id);
      console.log('=== END CREATE VOUCHER API RESPONSE ===');
      setSuccess('Tạo voucher thành công!');
      setFormData({
        description: '',
        discount_value: '',
        max_usage: '',
        start_date: '',
        end_date: ''
      });
      setIsCreateModalOpen(false);
      loadVouchers();
    } catch (err) {
      console.error('Error creating voucher:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVoucher = (voucher) => {
    console.log('=== EDITING VOUCHER ===');
    console.log('Full voucher object:', voucher);
    console.log('Voucher ID:', voucher.voucher_id);
    console.log('Voucher code:', voucher.code);
    console.log('Voucher max_usage:', voucher.max_usage);
    console.log('Voucher used_count:', voucher.used_count);
    console.log('All voucher keys:', Object.keys(voucher));
    console.log('=== END EDITING VOUCHER ===');
    
    setEditingVoucher(voucher);
    setFormData({
      description: voucher.description,
      discount_value: voucher.discount_value.toString(),
      max_usage: voucher.max_usage.toString(),
      start_date: voucher.start_date.split('T')[0],
      end_date: voucher.end_date.split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      if (!formData.description || !formData.discount_value || !formData.max_usage || !formData.start_date || !formData.end_date) {
        setError('Vui lòng điền đầy đủ thông tin');
        setLoading(false);
        return;
      }

      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        setError('Ngày kết thúc phải sau ngày bắt đầu');
        setLoading(false);
        return;
      }

      const discountValue = parseInt(formData.discount_value);
      if (discountValue <= 0) {
        setError('Giá trị giảm phải lớn hơn 0 VNĐ');
        setLoading(false);
        return;
      }

      const maxUsage = parseInt(formData.max_usage);
      if (maxUsage <= 0) {
        setError('Số lần sử dụng tối đa phải lớn hơn 0');
        setLoading(false);
        return;
      }

      const response = await axios.put(`/api/vouchers/${editingVoucher.voucher_id}`, {
        description: formData.description,
        discount_value: discountValue,
        max_usage: maxUsage,
        start_date: formData.start_date,
        end_date: formData.end_date
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Log chi tiết response khi cập nhật voucher
      console.log('=== UPDATE VOUCHER API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Updated voucher with ID:', editingVoucher.voucher_id);
      console.log('=== END UPDATE VOUCHER API RESPONSE ===');
      setSuccess('Cập nhật voucher thành công!');
      setFormData({
        description: '',
        discount_value: '',
        max_usage: '',
        start_date: '',
        end_date: ''
      });
      setEditingVoucher(null);
      setIsEditModalOpen(false);
      loadVouchers();
    } catch (err) {
      console.error('Error updating voucher:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucher_id) => {
    console.log('Deleting voucher with ID:', voucher_id);
    if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.delete(`/api/vouchers/${voucher_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Successfully deleted voucher with ID:', voucher_id);
      setSuccess('Xóa voucher thành công!');
      loadVouchers();
    } catch (err) {
      console.error('Error deleting voucher:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa voucher');
    } finally {
      setLoading(false);
    }
  };

  const getVoucherStatus = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);

    if (now < startDate) return { status: 'upcoming', text: 'Sắp diễn ra', color: '#1890ff' };
    if (now > endDate) return { status: 'expired', text: 'Đã hết hạn', color: '#ff4d4f' };
    if (voucher.used_count >= voucher.max_usage) return { status: 'exhausted', text: 'Đã hết lượt', color: '#faad14' };
    return { status: 'active', text: 'Đang hoạt động', color: '#52c41a' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="voucher-management">
      <div className="voucher-header">
        <h1>Quản lý Voucher</h1>
        <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>
          <PlusOutlined /> Tạo voucher mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="voucher-stats">
        <div className="stat-card">
          <h3>Tổng voucher</h3>
          <span className="stat-number">{vouchers.length}</span>
        </div>
        <div className="stat-card">
          <h3>Đang hoạt động</h3>
          <span className="stat-number">
            {vouchers.filter(v => getVoucherStatus(v).status === 'active').length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Đã hết hạn</h3>
          <span className="stat-number">
            {vouchers.filter(v => getVoucherStatus(v).status === 'expired').length}
          </span>
        </div>
      </div>

      <div className="voucher-table-container">
        <table className="voucher-table">
          <thead>
            <tr>
              <th>Mô tả</th>
              <th>Mã code</th>
              <th>Giá trị giảm</th>
              <th>Sử dụng</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="loading-cell">Đang tải...</td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-cell">Chưa có voucher nào</td>
              </tr>
            ) : (
              vouchers.map(voucher => {
                        const status = getVoucherStatus(voucher);
                        console.log('=== RENDERING VOUCHER ===');
                        console.log('Voucher ID:', voucher.voucher_id);
                        console.log('Voucher code:', voucher.code);
                        console.log('Voucher description:', voucher.description);
                        console.log('Voucher max_usage:', voucher.max_usage);
                        console.log('Voucher used_count:', voucher.used_count);
                        console.log('Voucher status:', status);
                        console.log('=== END RENDERING VOUCHER ===');
                        return (
                          <tr key={voucher.voucher_id}>
                            <td>{voucher.description}</td>
                            <td className="code-cell">
                              <span>{voucher.code}</span>
                              <button
                                className="copy-btn"
                                onClick={() => navigator.clipboard.writeText(voucher.code)}
                                title="Sao chép mã"
                                style={{ marginLeft: 8 }}
                              >
                                <CopyOutlined />
                              </button>
                            </td>
                            <td>{voucher.discount_value.toLocaleString('vi-VN')}₫</td>
                            <td>{voucher.used_count || 0}/{voucher.max_usage}</td>
                            <td>{formatDate(voucher.start_date)}</td>
                            <td>{formatDate(voucher.end_date)}</td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: status.color }}>
                                {status.text}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-wrapper">
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() => handleEditVoucher(voucher)}
                                  title="Chỉnh sửa"
                                >
                                  <EditOutlined />
                                </button>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDeleteVoucher(voucher.voucher_id)}
                                  title="Xóa"
                                >
                                  <DeleteOutlined />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Create Voucher Modal */}
              {isCreateModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content create-voucher-modal">
                    <div className="modal-header">
                      <h2>
                        <PlusOutlined />
                        Tạo voucher mới
                      </h2>
                      <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>×</button>
                    </div>
                    
                    <form onSubmit={handleCreateVoucher} className="voucher-form">
                      <div className="form-group">
                        <label htmlFor="description">Mô tả voucher *</label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Nhập mô tả voucher..."
                          required
                          rows={3}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="discount_value">Giá trị giảm (VNĐ) *</label>
                          <input
                            type="number"
                            id="discount_value"
                            name="discount_value"
                            value={formData.discount_value}
                            onChange={handleInputChange}
                            placeholder="10000"
                            min="1000"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="max_usage">Số lần sử dụng tối đa *</label>
                          <input
                            type="number"
                            id="max_usage"
                            name="max_usage"
                            value={formData.max_usage}
                            onChange={handleInputChange}
                            placeholder="100"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="start_date">Ngày bắt đầu *</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="end_date">Ngày kết thúc *</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="modal-actions">
                        <button 
                          type="button" 
                          className="cancel-btn" 
                          onClick={() => setIsCreateModalOpen(false)}
                        >
                          Hủy
                        </button>
                        <button 
                          type="submit" 
                          className="submit-btn" 
                          disabled={loading}
                        >
                          <PlusOutlined />
                          {loading ? 'Đang tạo...' : 'Tạo voucher'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
        
              {/* Edit Voucher Modal */}
              {isEditModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content edit-voucher-modal">
                    <div className="modal-header">
                      <h2>
                        <EditOutlined />
                        Chỉnh sửa voucher
                      </h2>
                      <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>×</button>
                    </div>
                    
                    <form onSubmit={handleUpdateVoucher} className="voucher-form">
                      <div className="form-group">
                        <label htmlFor="edit_description">Mô tả voucher *</label>
                        <textarea
                          id="edit_description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Nhập mô tả voucher..."
                          required
                          rows={3}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="edit_discount_value">Giá trị giảm (VNĐ) *</label>
                          <input
                            type="number"
                            id="edit_discount_value"
                            name="discount_value"
                            value={formData.discount_value}
                            onChange={handleInputChange}
                            placeholder="10000"
                            min="1000"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="edit_max_usage">Số lần sử dụng tối đa *</label>
                          <input
                            type="number"
                            id="edit_max_usage"
                            name="max_usage"
                            value={formData.max_usage}
                            onChange={handleInputChange}
                            placeholder="100"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="edit_start_date">Ngày bắt đầu *</label>
                          <input
                            type="date"
                            id="edit_start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="edit_end_date">Ngày kết thúc *</label>
                          <input
                            type="date"
                            id="edit_end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="modal-actions">
                        <button 
                          type="button" 
                          className="cancel-btn" 
                          onClick={() => setIsEditModalOpen(false)}
                        >
                          Hủy
                        </button>
                        <button 
                          type="submit" 
                          className="submit-btn" 
                          disabled={loading}
                        >
                          <EditOutlined />
                          {loading ? 'Đang cập nhật...' : 'Cập nhật voucher'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
    </div>
  );
};

export default VoucherManagement;
        