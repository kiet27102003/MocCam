import React, { useState, useEffect } from "react";
import {
  RobotOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { aiModelApi } from "../../../config/api";
import "./AIModelManagement.css";

const AIModelManagement = () => {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    model_name: "",
    version: "",
    description: "",
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await aiModelApi.getAIModels();
      setModels(response.data);
      setFilteredModels(response.data);
    } catch (err) {
      setError("Không thể tải danh sách AI Models");
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
      model_name: "",
      version: "",
      description: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (model) => {
    setIsEditing(true);
    setEditingModel(model);
    setFormData({
      model_name: model.model_name || "",
      version: model.version || "",
      description: model.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
    };

    if (!payload.model_name || !payload.version) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await aiModelApi.updateAIModel(editingModel.model_id, payload);
        setSuccess("Cập nhật AI Model thành công!");
      } else {
        await aiModelApi.createAIModel(payload);
        setSuccess("Tạo AI Model thành công!");
      }
      setIsModalOpen(false);
      loadModels();
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
    if (!window.confirm("Bạn có chắc muốn xóa AI Model này?")) return;
    try {
      setLoading(true);
      await aiModelApi.deleteAIModel(id);
      setSuccess("Xóa AI Model thành công!");
      loadModels();
    } catch (err) {
      setError("Không thể xóa AI Model.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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


  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredModels(models);
      return;
    }
    
    const filtered = models.filter(model =>
      model.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.version?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredModels(filtered);
  };

  // Effect to apply search when models change
  useEffect(() => {
    handleSearch();
  }, [models, searchQuery]);

  return (
    <div className="ai-model-management">
      <div className="model-header">
        <h1><RobotOutlined /> Quản lý AI Models</h1>
        <div className="header-actions">
          <button className="reload-btn" onClick={loadModels} title="Làm mới">
            <ReloadOutlined />
          </button>
          <button className="create-btn" onClick={handleOpenCreate}>
            <PlusOutlined /> Tạo AI Model mới
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm AI Model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <SearchOutlined />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="model-stats">
        <div className="stat-card">
          <h3>Tổng AI Models</h3>
          <span className="stat-number">{models.length}</span>
        </div>
        <div className="stat-card">
          <h3>Kết quả tìm kiếm</h3>
          <span className="stat-number">{filteredModels.length}</span>
        </div>
      </div>

      <div className="model-table-container">
        <table className="model-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Version</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-cell">Đang tải...</td>
              </tr>
            ) : filteredModels.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">Không tìm thấy AI Model nào</td>
              </tr>
            ) : (
              filteredModels.map(model => {
                return (
                  <tr key={model.model_id}>
                    <td className="model-name">{model.model_name}</td>
                    <td className="version">{model.version || 'Chưa cập nhật'}</td>
                    <td className="description">{model.description || 'Chưa có mô tả'}</td>
                    <td className="created-date">{formatDate(model.created_at)}</td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenEdit(model)}
                          title="Chỉnh sửa"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(model.model_id)}
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content create-model-modal">
            <div className="modal-header">
              <h2>
                <PlusOutlined />
                {isEditing ? "Chỉnh sửa AI Model" : "Tạo AI Model mới"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="model-form">
              <div className="form-group">
                <label htmlFor="model_name">Tên Model *</label>
                <input
                  type="text"
                  id="model_name"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên model"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="version">Version *</label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="Nhập version (ví dụ: 1.0.0)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả model"
                  rows="3"
                />
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

export default AIModelManagement;

