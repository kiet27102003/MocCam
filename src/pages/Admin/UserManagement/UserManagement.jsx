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
  CalendarOutlined,
  TeamOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
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
    role: 'customer',
    date_of_birth: '',
    picture: ''
  });

  // Form state for editing user
  const [editUser, setEditUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: 'customer',
    date_of_birth: '',
    picture: ''
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
      const response = await fetch('http://localhost:3000/api/users', {
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
    if (!newUser.date_of_birth) errors.date_of_birth = 'Ngày sinh là bắt buộc';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/create', {
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
          role: 'customer',
          date_of_birth: '',
          picture: ''
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
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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
      role: user.role || 'customer',
      date_of_birth: user.date_of_birth || '',
      picture: user.picture || ''
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
    if (!editUser.date_of_birth) errors.date_of_birth = 'Ngày sinh là bắt buộc';

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
        role: editUser.role,
        date_of_birth: editUser.date_of_birth,
        picture: editUser.picture
      };
      
      // Only include password if it's not empty
      if (editUser.password.trim()) {
        updateData.password = editUser.password;
      }

      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
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
          role: 'customer',
          date_of_birth: '',
          picture: ''
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
      
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove user from the list
        setUsers(users.filter(user => 
          (user.user_id || user.id) !== userId
        ));
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } else {
        console.error('Failed to delete user');
        // You can add error handling here (show notification, etc.)
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      // You can add error handling here (show notification, etc.)
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
          <div className="users-table">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <UserOutlined />
                <h3>Không tìm thấy người dùng</h3>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar">
                    {user.picture ? (
                      <img src={user.picture} alt={user.full_name} />
                    ) : (
                      <UserOutlined />
                    )}
                  </div>
                  
                  <div className="user-info">
                    <div className="user-name">
                      <h4>{user.full_name || 'Chưa cập nhật'}</h4>
                      {getRoleBadge(user.role)}
                    </div>
                    
                    <div className="user-details">
                      <div className="detail-item">
                        <MailOutlined />
                        <span>{user.email}</span>
                      </div>
                      <div className="detail-item">
                        <PhoneOutlined />
                        <span>{user.phone_number || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="detail-item">
                        <CalendarOutlined />
                        <span>{formatDate(user.date_of_birth)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-actions">
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
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
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
            
            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className={formErrors.email ? 'error' : ''}
                    placeholder="Nhập email"
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Mật khẩu *</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className={formErrors.password ? 'error' : ''}
                    placeholder="Nhập mật khẩu"
                  />
                  {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={newUser.full_name}
                    onChange={handleInputChange}
                    className={formErrors.full_name ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                  />
                  {formErrors.full_name && <span className="error-text">{formErrors.full_name}</span>}
                </div>
                
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={newUser.phone_number}
                    onChange={handleInputChange}
                    className={formErrors.phone_number ? 'error' : ''}
                    placeholder="Nhập số điện thoại"
                  />
                  {formErrors.phone_number && <span className="error-text">{formErrors.phone_number}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Vai trò</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ngày sinh *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={newUser.date_of_birth}
                    onChange={handleInputChange}
                    className={formErrors.date_of_birth ? 'error' : ''}
                  />
                  {formErrors.date_of_birth && <span className="error-text">{formErrors.date_of_birth}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>URL ảnh đại diện</label>
                <input
                  type="url"
                  name="picture"
                  value={newUser.picture}
                  onChange={handleInputChange}
                  placeholder="Nhập URL ảnh đại diện (tùy chọn)"
                />
              </div>
              
              <div className="form-actions">
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
                {selectedUser.picture ? (
                  <img src={selectedUser.picture} alt={selectedUser.full_name} />
                ) : (
                  <UserOutlined />
                )}
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
          <div className="modal-content">
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
            
            <form onSubmit={handleUpdateUser} className="add-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleEditInputChange}
                    className={editFormErrors.email ? 'error' : ''}
                    placeholder="Nhập email"
                  />
                  {editFormErrors.email && <span className="error-text">{editFormErrors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="password"
                    value={editUser.password}
                    onChange={handleEditInputChange}
                    placeholder="Để trống nếu không muốn đổi mật khẩu"
                  />
                  <small className="form-hint">Để trống nếu không muốn thay đổi mật khẩu</small>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={editUser.full_name}
                    onChange={handleEditInputChange}
                    className={editFormErrors.full_name ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                  />
                  {editFormErrors.full_name && <span className="error-text">{editFormErrors.full_name}</span>}
                </div>
                
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={editUser.phone_number}
                    onChange={handleEditInputChange}
                    className={editFormErrors.phone_number ? 'error' : ''}
                    placeholder="Nhập số điện thoại"
                  />
                  {editFormErrors.phone_number && <span className="error-text">{editFormErrors.phone_number}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Vai trò</label>
                  <select
                    name="role"
                    value={editUser.role}
                    onChange={handleEditInputChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ngày sinh *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={editUser.date_of_birth}
                    onChange={handleEditInputChange}
                    className={editFormErrors.date_of_birth ? 'error' : ''}
                  />
                  {editFormErrors.date_of_birth && <span className="error-text">{editFormErrors.date_of_birth}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>URL ảnh đại diện</label>
                <input
                  type="url"
                  name="picture"
                  value={editUser.picture}
                  onChange={handleEditInputChange}
                  placeholder="Nhập URL ảnh đại diện (tùy chọn)"
                />
              </div>
              
              <div className="form-actions">
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
                    {userToDelete.picture ? (
                      <img src={userToDelete.picture} alt={userToDelete.full_name} />
                    ) : (
                      <UserOutlined />
                    )}
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
