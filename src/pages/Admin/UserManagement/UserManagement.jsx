import React, { useState, useEffect, useContext } from 'react';
import { 
  UserOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import './UserManagement.css';
import RoleContext from '../../../contexts/RoleContext';
import { ROLES } from '../../../constants/roleConstants';

const UserManagement = () => {
  const { hasRole } = useContext(RoleContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state for adding new user
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    picture: '',
    role: 'customer'
  });

  // Form state for editing user
  const [editUser, setEditUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    picture: '',
    role: 'customer'
  });

  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!newUser.email) errors.email = 'Email là bắt buộc';
    if (!newUser.password) errors.password = 'Mật khẩu là bắt buộc';
    if (!newUser.full_name) errors.full_name = 'Họ tên là bắt buộc';
    if (!newUser.phone_number) errors.phone_number = 'Số điện thoại là bắt buộc';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setShowAddForm(false);
        setNewUser({
          email: '',
          password: '',
          full_name: '',
          phone_number: '',
          date_of_birth: '',
          picture: '',
          role: 'customer'
        });
        setFormErrors({});
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone_number?.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: '#dc2626', label: 'Admin' },
      user: { color: '#059669', label: 'Customer' },
      employee: { color: '#7c3aed', label: 'Employee' }
    };
    
    const config = roleConfig[role] || { color: '#6b7280', label: role };
    
    return (
      <span 
        className="role-badge"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    );
  };


  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUser({
      email: user.email || '',
      password: '', // Don't pre-fill password for security
      full_name: user.full_name || '',
      phone_number: user.phone_number || '',
      date_of_birth: user.date_of_birth || '',
      picture: user.picture || '',
      role: user.role || 'customer'
    });
    setEditFormErrors({});
    setShowEditForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!editUser.email) errors.email = 'Email là bắt buộc';
    if (!editUser.full_name) errors.full_name = 'Họ tên là bắt buộc';
    if (!editUser.phone_number) errors.phone_number = 'Số điện thoại là bắt buộc';

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = selectedUser.user_id || selectedUser.id;
      
      // Prepare data - only include password if it's provided
      const updateData = {
        email: editUser.email,
        full_name: editUser.full_name,
        phone_number: editUser.phone_number,
        date_of_birth: editUser.date_of_birth,
        role: editUser.role
      };
      
      // Only include password if it's not empty
      if (editUser.password.trim()) {
        updateData.password = editUser.password;
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update the user in the list
        setUsers(users.map(user => 
          (user.user_id || user.id) === userId ? updatedUser : user
        ));
        setShowEditForm(false);
        setEditUser({
          email: '',
          password: '',
          full_name: '',
          phone_number: '',
          date_of_birth: '',
          picture: '',
          role: 'customer'
        });
        setEditFormErrors({});
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (editFormErrors[name]) {
      setEditFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = userToDelete.user_id || userToDelete.id;
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Đọc response data
      let responseData = {};
      const responseText = await response.text();
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          // Response không phải JSON, sử dụng text làm message
          responseData = { message: responseText };
        }
      }

      if (response.ok) {
        // Remove user from the list
        setUsers(users.filter(user => 
          (user.user_id || user.id) !== userId
        ));
        setShowDeleteConfirm(false);
        setUserToDelete(null);
        message.success(responseData.message || '✅ Xóa người dùng thành công');
      } else {
        const errorMessage = responseData.message || `Không thể xóa người dùng (${response.status})`;
        const errorReason = responseData.reason || '';
        
        console.error('Failed to delete user:', {
          status: response.status,
          statusText: response.statusText,
          errorData: responseData
        });
        
        // Hiển thị error message chi tiết từ backend
        if (errorReason) {
          message.error(`${errorMessage}. ${errorReason}`, 5);
        } else {
          message.error(errorMessage, 5);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <UserOutlined />
            Quản lý người dùng
          </h1>
          <p>Quản lý thông tin và quyền hạn của người dùng trong hệ thống</p>
        </div>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddForm(true)}
        >
          <PlusOutlined />
          Thêm người dùng
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FilterOutlined />
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <button 
          className="refresh-btn"
          onClick={fetchUsers}
          disabled={loading}
        >
          <ReloadOutlined />
          Làm mới
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="table-header">
          <h3>
            <TeamOutlined />
            Danh sách người dùng ({filteredUsers.length})
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
          <div className="users-table-wrapper">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <UserOutlined />
                <h3>Không tìm thấy người dùng</h3>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ và tên</th>
                    <th>Vai trò</th>
                    <th>Số điện thoại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user.user_id} className="user-row">
                      <td className="user-id">
                        <span className="id-badge">
                          #{user.user_id || user.id || 'N/A'}
                        </span>
                      </td>
                      <td className="user-name">
                        <div className="name-cell">
                          <div className="user-avatar">
                            {(user.picture || user.avatar) ? (
                              <img 
                                src={user.picture || user.avatar} 
                                alt={user.full_name || 'Avatar'}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const icon = e.target.parentElement.querySelector('.table-avatar-icon');
                                  if (icon) icon.style.display = 'block';
                                }}
                              />
                            ) : null}
                            <UserOutlined 
                              className="table-avatar-icon"
                              style={{ display: (user.picture || user.avatar) ? 'none' : 'block' }}
                            />
                          </div>
                          <div className="name-info">
                            <span className="name">{user.full_name || 'Chưa cập nhật'}</span>
                            <span className="email">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="user-role">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="user-phone">
                        <span className="phone-number">
                          {user.phone_number || 'Chưa cập nhật'}
                        </span>
                      </td>
                      <td className="user-actions">
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => handleViewUser(user)}
                            title="Xem chi tiết"
                          >
                            <EyeOutlined />
                          </button>
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditUser(user)}
                            title="Chỉnh sửa"
                          >
                            <EditOutlined />
                          </button>
                          {hasRole(ROLES.ADMIN) && (
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteUser(user)}
                              title="Xóa"
                            >
                              <DeleteOutlined />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content create-user-modal">
            <div className="modal-header">
              <h2>
                <PlusOutlined />
                Thêm người dùng mới
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="user-form">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                  placeholder="Nhập email"
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? 'error' : ''}
                  placeholder="Nhập mật khẩu"
                />
                {formErrors.password && <span className="error-text">{formErrors.password}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full_name">Họ và tên *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={newUser.full_name}
                    onChange={handleInputChange}
                    className={formErrors.full_name ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                  />
                  {formErrors.full_name && <span className="error-text">{formErrors.full_name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone_number">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={newUser.phone_number}
                    onChange={handleInputChange}
                    className={formErrors.phone_number ? 'error' : ''}
                    placeholder="Nhập số điện thoại"
                  />
                  {formErrors.phone_number && <span className="error-text">{formErrors.phone_number}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="date_of_birth">Ngày sinh</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={newUser.date_of_birth}
                  onChange={handleInputChange}
                  className={formErrors.date_of_birth ? 'error' : ''}
                />
                {formErrors.date_of_birth && <span className="error-text">{formErrors.date_of_birth}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  <PlusOutlined />
                  {loading ? 'Đang tạo...' : 'Tạo người dùng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content user-detail-modal">
            <div className="modal-header">
              <h2>
                <UserOutlined />
                Chi tiết người dùng
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowUserDetail(false)}
              >
                ×
              </button>
            </div>
            
            <div className="user-detail-content">
              <div className="user-detail-avatar">
                {(selectedUser.picture || selectedUser.avatar) ? (
                  <img 
                    src={selectedUser.picture || selectedUser.avatar} 
                    alt={selectedUser.full_name || 'Avatar'}
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.target.style.display = 'none';
                      const icon = e.target.parentElement.querySelector('.avatar-icon');
                      if (icon) icon.style.display = 'block';
                    }}
                  />
                ) : null}
                <UserOutlined 
                  className="avatar-icon"
                  style={{ display: (selectedUser.picture || selectedUser.avatar) ? 'none' : 'block' }} 
                />
              </div>
              
              <div className="user-detail-info">
                <h3>{selectedUser.full_name || 'Chưa cập nhật'}</h3>
                {getRoleBadge(selectedUser.role)}
                
                <div className="detail-grid">
                  <div className="detail-item">
                    <IdcardOutlined />
                    <div>
                      <label>User ID</label>
                      <span>{selectedUser.user_id || selectedUser.id || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <MailOutlined />
                    <div>
                      <label>Email</label>
                      <span>{selectedUser.email}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <PhoneOutlined />
                    <div>
                      <label>Số điện thoại</label>
                      <span>{selectedUser.phone_number || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <CalendarOutlined />
                    <div>
                      <label>Ngày sinh</label>
                      <span>{formatDate(selectedUser.date_of_birth)}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <TeamOutlined />
                    <div>
                      <label>Vai trò</label>
                      <span>{selectedUser.role}</span>
                    </div>
                  </div>
                  
                  {(selectedUser.picture || selectedUser.avatar) && (
                    <div className="detail-item">
                      <UserOutlined />
                      <div>
                        <label>Ảnh đại diện</label>
                        <span style={{ 
                          wordBreak: 'break-all', 
                          fontSize: '0.9em',
                          color: '#1890ff',
                          fontFamily: 'monospace'
                        }}>
                          {selectedUser.picture || selectedUser.avatar}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <ClockCircleOutlined />
                    <div>
                      <label>Ngày tạo</label>
                      <span>{formatDateTime(selectedUser.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="edit-btn"
                onClick={() => {
                  setShowUserDetail(false);
                  handleEditUser(selectedUser);
                }}
              >
                <EditOutlined />
                Chỉnh sửa
              </button>
              <button 
                className="close-btn"
                onClick={() => setShowUserDetail(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditForm && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content edit-user-modal">
            <div className="modal-header">
              <h2>
                <EditOutlined />
                Chỉnh sửa người dùng
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="user-form">
              <div className="form-group">
                <label htmlFor="edit_email">Email *</label>
                <input
                  type="email"
                  id="edit_email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditInputChange}
                  className={editFormErrors.email ? 'error' : ''}
                  placeholder="Nhập email"
                />
                {editFormErrors.email && <span className="error-text">{editFormErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="edit_password">Mật khẩu mới</label>
                <input
                  type="password"
                  id="edit_password"
                  name="password"
                  value={editUser.password}
                  onChange={handleEditInputChange}
                  placeholder="Để trống nếu không muốn đổi mật khẩu"
                />
                <small className="form-hint">Để trống nếu không muốn thay đổi mật khẩu</small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit_full_name">Họ và tên *</label>
                  <input
                    type="text"
                    id="edit_full_name"
                    name="full_name"
                    value={editUser.full_name}
                    onChange={handleEditInputChange}
                    className={editFormErrors.full_name ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                  />
                  {editFormErrors.full_name && <span className="error-text">{editFormErrors.full_name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit_phone_number">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="edit_phone_number"
                    name="phone_number"
                    value={editUser.phone_number}
                    onChange={handleEditInputChange}
                    className={editFormErrors.phone_number ? 'error' : ''}
                    placeholder="Nhập số điện thoại"
                  />
                  {editFormErrors.phone_number && <span className="error-text">{editFormErrors.phone_number}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit_date_of_birth">Ngày sinh</label>
                <input
                  type="date"
                  id="edit_date_of_birth"
                  name="date_of_birth"
                  value={editUser.date_of_birth}
                  onChange={handleEditInputChange}
                  className={editFormErrors.date_of_birth ? 'error' : ''}
                />
                {editFormErrors.date_of_birth && <span className="error-text">{editFormErrors.date_of_birth}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="edit_role">Vai trò</label>
                <select
                  id="edit_role"
                  name="role"
                  value={editUser.role}
                  onChange={handleEditInputChange}
                >
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditForm(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  <EditOutlined />
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <h2>
                <ExclamationCircleOutlined />
                Xác nhận xóa người dùng
              </h2>
            </div>
            
            <div className="delete-confirm-content">
              <div className="warning-icon">
                <ExclamationCircleOutlined />
              </div>
              
              <div className="warning-text">
                <h3>Bạn có chắc chắn muốn xóa người dùng này?</h3>
                <p>Thao tác này không thể hoàn tác. Tất cả dữ liệu của người dùng sẽ bị xóa vĩnh viễn.</p>
                
                <div className="user-to-delete">
                  <div className="user-avatar">
                    <UserOutlined />
                  </div>
                  <div className="user-info">
                    <h4>{userToDelete.full_name || 'Chưa cập nhật'}</h4>
                    <p>{userToDelete.email}</p>
                    <span className="role-badge" style={{ backgroundColor: userToDelete.role === 'admin' ? '#dc2626' : userToDelete.role === 'employee' ? '#7c3aed' : '#059669' }}>
                      {userToDelete.role === 'admin' ? 'Admin' : userToDelete.role === 'employee' ? 'Employee' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={cancelDeleteUser}
                disabled={deleting}
              >
                Hủy
              </button>
              <button 
                className="delete-confirm-btn"
                onClick={confirmDeleteUser}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa người dùng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
