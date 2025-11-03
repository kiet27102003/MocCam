import React, { useState, useEffect } from "react";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import './ProfileModal.css';

const ProfileModal = ({ visible, onClose, userData, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    picture: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && visible) {
      console.log("🔄 Load lại thông tin hồ sơ vào form:", userData);
      setFormData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        date_of_birth: userData.date_of_birth
          ? dayjs(userData.date_of_birth)
          : null,
        picture: userData.picture || "",
      });
    }
  }, [userData, visible]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return dayjs(dateString).format("DD/MM/YYYY");
    } catch {
      return dateString;
    }
  };
  

  // Lock body scroll when modal is open
  useEffect(() => {
    if (visible) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [visible]);

  const token = localStorage.getItem("token");

  // Gửi request cập nhật thông tin user
  const handleUpdateProfile = async () => {
    const userId = userData?.user_id || userData?.id;
    if (!userId) return message.error("Không tìm thấy ID người dùng.");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        date_of_birth: formData.date_of_birth
          ? dayjs(formData.date_of_birth).format("YYYY-MM-DD")
          : null,
      };
      const response = await axios.put(`/api/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('📡 [ProfileModal] Response từ API PUT /api/users/' + userId + ':', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        timestamp: new Date().toISOString()
      });

      message.success("Cập nhật hồ sơ thành công 🎉");
      onProfileUpdated({ ...userData, ...payload });
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      message.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  return (
    <div 
      className="modal-overlay" 
      style={{ display: visible ? 'flex' : 'none' }}
      onClick={handleOverlayClick}
    >
      <div className="modal-content create-user-modal">
        <div className="modal-header">
          <h2>
            👤 Cập nhật hồ sơ cá nhân
          </h2>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <form className="user-form">
          <div className="form-group">
            <label htmlFor="full_name">Họ và tên</label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_id">ID người dùng</label>
            <input
              type="text"
              id="user_id"
              value={userData?.user_id || userData?.id || "Chưa có thông tin"}
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Vai trò</label>
            <input
              type="text"
              id="role"
              value={userData?.role ? userData.role.toUpperCase() : "Chưa có thông tin"}
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Số điện thoại</label>
            <input
              type="tel"
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_of_birth">Ngày sinh</label>
            <DatePicker
              id="date_of_birth"
              className="w-full"
              value={formData.date_of_birth}
              onChange={(date) => handleChange("date_of_birth", date)}
              format="DD/MM/YYYY"
              style={{ width: '100%', height: '40px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="picture">Ảnh đại diện (URL)</label>
            <input
              type="url"
              id="picture"
              value={formData.picture}
              onChange={(e) => handleChange("picture", e.target.value)}
              placeholder="Nhập URL ảnh đại diện"
            />
            {formData.picture && (
              <img
                src={formData.picture}
                alt="Avatar preview"
                style={{
                  width: '80px',
                  height: '80px',
                  marginTop: '12px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="created_at">Ngày tạo tài khoản</label>
            <input
              type="text"
              id="created_at"
              value={formatDate(userData?.created_at)}
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Hủy
            </button>
            <button 
              type="button" 
              className="submit-btn"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
