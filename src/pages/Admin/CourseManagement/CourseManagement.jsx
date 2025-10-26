import React, { useState, useEffect } from "react";
import {
  BookOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { courseApi } from "../../../config/api";
import "./CourseManagement.css";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    level: "Beginner",
    is_free: true,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAllCourses();
      console.log("📦 Course API Response:", response);
      console.log("📦 Course Data:", response.data);
      console.log("📦 Number of courses:", response.data?.length);
      if (response.data && response.data.length > 0) {
        console.log("📦 First course example:", response.data[0]);
      }
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (err) {
      setError("Không thể tải danh sách khóa học");
      console.error("❌ Error loading courses:", err);
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
      course_name: "",
      description: "",
      level: "Beginner",
      is_free: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setIsEditing(true);
    setEditingCourse(course);
    setFormData({
      course_name: course.course_name || "",
      description: course.description || "",
      level: course.level || "Beginner",
      is_free: course.is_free !== undefined ? course.is_free : true,
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

    if (!payload.course_name) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        console.log("📝 Updating course with ID:", editingCourse.course_id);
        console.log("📝 Update payload:", payload);
        const response = await courseApi.updateCourse(editingCourse.course_id, payload);
        console.log("✅ Update response:", response);
        setSuccess("Cập nhật khóa học thành công!");
      } else {
        console.log("➕ Creating new course");
        console.log("➕ Create payload:", payload);
        const response = await courseApi.createCourse(payload);
        console.log("✅ Create response:", response);
        setSuccess("Tạo khóa học thành công!");
      }
      setIsModalOpen(false);
      loadCourses();
    } catch (err) {
      console.error("❌ Error in submit:", err);
      console.error("❌ Error response:", err.response);
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra khi xử lý yêu cầu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      setLoading(true);
      await courseApi.deleteCourse(id);
      setSuccess("Xóa khóa học thành công!");
      loadCourses();
    } catch (err) {
      setError("Không thể xóa khóa học.");
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const getLevelLabel = (level) => {
    const normalizedLevel = level?.toLowerCase();
    console.log("🔍 Level received:", level, "→ Normalized:", normalizedLevel);
    
    const levels = {
      beginner: { text: 'Beginner', color: '#52c41a' },
      advanced: { text: 'Advanced', color: '#f5222d' }
    };
    
    const result = levels[normalizedLevel] || { text: 'N/A', color: '#666' };
    console.log("🎯 Level result:", result);
    
    return result;
  };

  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }
    
    const filtered = courses.filter(course =>
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  // Effect to apply search when courses change
  useEffect(() => {
    handleSearch();
  }, [courses, searchQuery]);

  return (
    <div className="course-management">
      <div className="course-header">
        <h1>Quản lý Khóa Học</h1>
        <div className="header-actions">
          <button className="reload-btn" onClick={loadCourses} title="Làm mới">
            <ReloadOutlined />
          </button>
          <button className="create-btn" onClick={handleOpenCreate}>
            <PlusOutlined /> Tạo khóa học mới
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
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

      <div className="course-stats">
        <div className="stat-card">
          <h3>Tổng khóa học</h3>
          <span className="stat-number">{courses.length}</span>
        </div>
        <div className="stat-card">
          <h3>Khóa học miễn phí</h3>
          <span className="stat-number">
            {courses.filter(c => c.is_free).length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Khóa học trả phí</h3>
          <span className="stat-number">
            {courses.filter(c => !c.is_free).length}
          </span>
        </div>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Tên khóa học</th>
              <th>Mô tả</th>
              <th>Độ khó</th>
              <th>Loại</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">Đang tải...</td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">Không tìm thấy khóa học nào</td>
              </tr>
            ) : (
              filteredCourses.map(course => {
                const levelInfo = getLevelLabel(course.level);
                const isFree = course.is_free;
                const typeStatus = isFree ? 
                  { status: 'free', text: 'Miễn phí', color: '#52c41a' } : 
                  { status: 'paid', text: 'Trả phí', color: '#1890ff' };
                
                return (
                  <tr key={course.course_id}>
                    <td className="course-name">{course.course_name}</td>
                    <td className="description">{course.description || 'Chưa có mô tả'}</td>
                    <td>
                      <span className="level-badge" style={{ backgroundColor: levelInfo.color }}>
                        {levelInfo.text}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: typeStatus.color }}>
                        {typeStatus.text}
                      </span>
                    </td>
                    <td className="created-date">{formatDate(course.created_at)}</td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenEdit(course)}
                          title="Chỉnh sửa"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(course.course_id)}
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
          <div className="modal-content create-course-modal">
            <div className="modal-header">
              <h2>
                <PlusOutlined />
                {isEditing ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-group">
                <label htmlFor="course_name">Tên khóa học *</label>
                <input
                  type="text"
                  id="course_name"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên khóa học"
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
                  placeholder="Nhập mô tả khóa học"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="level">Độ khó</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_free"
                    checked={formData.is_free}
                    onChange={handleInputChange}
                  />
                  Khóa học miễn phí
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

export default CourseManagement;
