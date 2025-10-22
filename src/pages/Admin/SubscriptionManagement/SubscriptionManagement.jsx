import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import axios from "axios";
import "./SubscriptionManagement.css";

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

  const [formData, setFormData] = useState({
    plan_name: "",
    description: "",
    price: "",
    currency: "VND",
    duration_in_days: "",
    is_active: true,
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subscription-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(res.data);
    } catch (err) {
      setError("Không thể tải danh sách gói đăng ký");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenCreate = () => {
    setFormData({
      plan_name: "",
      description: "",
      price: "",
      currency: "VND",
      duration_in_days: "",
      is_active: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subscription) => {
    setIsEditing(true);
    setEditingSubscription(subscription);
    setFormData({
      plan_name: subscription.plan_name,
      description: subscription.description,
      price: subscription.price,
      currency: subscription.currency,
      duration_in_days: subscription.duration_in_days,
      is_active: subscription.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      duration_in_days: parseInt(formData.duration_in_days),
    };

    if (!payload.plan_name || !payload.description || payload.price <= 0 || payload.duration_in_days <= 0) {
      setError("Vui lòng điền đầy đủ thông tin hợp lệ.");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(
          `/api/subscription-plans/update/${editingSubscription.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccess("Cập nhật gói đăng ký thành công!");
      } else {
        await axios.post("/api/subscription-plans/create", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSuccess("Tạo gói đăng ký thành công!");
      }
      setIsModalOpen(false);
      loadSubscriptions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra khi xử lý yêu cầu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa gói đăng ký này?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/api/subscription-plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa gói đăng ký thành công!");
      loadSubscriptions();
    } catch (err) {
      setError("Không thể xóa gói đăng ký.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    `${Number(price).toLocaleString("vi-VN")} VND`;

  const formatDuration = (days) => {
    if (days >= 365) return `${Math.floor(days / 365)} năm`;
    if (days >= 30) return `${Math.floor(days / 30)} tháng`;
    return `${days} ngày`;
  };

  return (
    <div className="subscription-management">
      <div className="subscription-header">
        <h1>Quản lý Gói Đăng Ký</h1>
        <button className="create-btn" onClick={handleOpenCreate}>
          <PlusOutlined /> Tạo gói đăng ký mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="subscription-stats">
        <div className="stat-card">
          <h3>Tổng gói</h3>
          <span className="stat-number">{subscriptions.length}</span>
        </div>
        <div className="stat-card">
          <h3>Đang hoạt động</h3>
          <span className="stat-number">
            {subscriptions.filter(s => s.is_active).length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Không hoạt động</h3>
          <span className="stat-number">
            {subscriptions.filter(s => !s.is_active).length}
          </span>
        </div>
      </div>

      <div className="subscription-table-container">
        <table className="subscription-table">
          <thead>
            <tr>
              <th>Tên gói</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">Đang tải...</td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">Chưa có gói đăng ký nào</td>
              </tr>
            ) : (
              subscriptions.map(subscription => {
                const status = subscription.is_active ? 
                  { status: 'active', text: 'Đang hoạt động', color: '#52c41a' } : 
                  { status: 'inactive', text: 'Không hoạt động', color: '#ff4d4f' };
                
                return (
                  <tr key={subscription.id}>
                    <td className="plan-name">{subscription.plan_name}</td>
                    <td className="description">{subscription.description}</td>
                    <td className="price">{formatPrice(subscription.price)}</td>
                    <td className="duration">{formatDuration(subscription.duration_in_days)}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: status.color }}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEdit(subscription)}
                        title="Chỉnh sửa"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(subscription.id)}
                        title="Xóa"
                      >
                        <DeleteOutlined />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content create-subscription-modal">
            <div className="modal-header">
              <h2>
                <PlusOutlined />
                {isEditing ? "Chỉnh sửa gói đăng ký" : "Tạo gói đăng ký mới"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="subscription-form">
              <div className="form-group">
                <label htmlFor="plan_name">Tên gói *</label>
                <input
                  type="text"
                  id="plan_name"
                  name="plan_name"
                  value={formData.plan_name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên gói đăng ký"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả gói đăng ký"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="1000"
                    step="1000"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="100000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="duration_in_days">Thời gian (ngày) *</label>
                  <input
                    type="number"
                    id="duration_in_days"
                    name="duration_in_days"
                    min="1"
                    value={formData.duration_in_days}
                    onChange={handleInputChange}
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Kích hoạt gói đăng ký
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  <PlusOutlined />
                  {loading
                    ? "Đang xử lý..."
                    : isEditing
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
