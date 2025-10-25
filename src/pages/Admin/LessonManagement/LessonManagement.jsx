import React, { useState, useEffect } from "react";
import {
  BookOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  FileImageOutlined
} from "@ant-design/icons";
import axios from "axios";
import "./LessonManagement.css";

const LessonManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const [formData, setFormData] = useState({
    course_id: "",
    lesson_name: "",
    description: "",
    video_url: "",
    picture_url: "",
    is_free: true,
  });

  useEffect(() => {
    loadLessons();
    loadCourses();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(res.data);
    } catch (err) {
      setError("Không thể tải danh sách khóa học");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading courses:", err);
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
      course_id: "",
      lesson_name: "",
      description: "",
      video_url: "",
      picture_url: "",
      is_free: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson) => {
    setIsEditing(true);
    setEditingLesson(lesson);
    setFormData({
      course_id: lesson.course_id,
      lesson_name: lesson.lesson_name,
      description: lesson.description || "",
      video_url: lesson.video_url || "",
      picture_url: lesson.picture_url || "",
      is_free: lesson.is_free,
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
      course_id: parseInt(formData.course_id),
    };

    if (!payload.course_id || !payload.lesson_name) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(
          `/api/lessons/${editingLesson.lesson_id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccess("Cập nhật khóa học thành công!");
      } else {
        await axios.post("/api/lessons/create", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSuccess("Tạo khóa học thành công!");
      }
      setIsModalOpen(false);
      loadLessons();
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
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Xóa khóa học thành công!");
      loadLessons();
    } catch (err) {
      setError("Không thể xóa khóa học.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.course_id === courseId);
    return course ? course.course_name : `Course ID: ${courseId}`;
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

  return (
    <div className="lesson-management">
      <div className="lesson-header">
        <h1>Quản lý Khóa Học</h1>
        <button className="create-btn" onClick={handleOpenCreate}>
          <PlusOutlined /> Tạo khóa học mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="lesson-stats">
        <div className="stat-card">
          <h3>Tổng khóa học</h3>
          <span className="stat-number">{lessons.length}</span>
        </div>
        <div className="stat-card">
          <h3>Khóa học miễn phí</h3>
          <span className="stat-number">
            {lessons.filter(l => l.is_free).length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Khóa học trả phí</h3>
          <span className="stat-number">
            {lessons.filter(l => !l.is_free).length}
          </span>
        </div>
      </div>

      <div className="lesson-table-container">
        <table className="lesson-table">
          <thead>
            <tr>
              <th>Tên khóa học</th>
              <th>Danh mục</th>
              <th>Mô tả</th>
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
            ) : lessons.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">Chưa có khóa học nào</td>
              </tr>
            ) : (
              lessons.map(lesson => {
                const isFree = lesson.is_free;
                const status = isFree ? 
                  { status: 'free', text: 'Miễn phí', color: '#52c41a' } : 
                  { status: 'paid', text: 'Trả phí', color: '#1890ff' };
                
                return (
                  <tr key={lesson.lesson_id}>
                    <td className="lesson-name">{lesson.lesson_name}</td>
                    <td className="course-name">{getCourseName(lesson.course_id)}</td>
                    <td className="description">{lesson.description || 'Chưa có mô tả'}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: status.color }}>
                        {status.text}
                      </span>
                    </td>
                    <td className="created-date">{formatDate(lesson.created_at)}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEdit(lesson)}
                        title="Chỉnh sửa"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(lesson.lesson_id)}
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
          <div className="modal-content create-lesson-modal">
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
            
            <form onSubmit={handleSubmit} className="lesson-form">
              <div className="form-group">
                <label htmlFor="course_id">Khóa học *</label>
                <select
                  id="course_id"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="lesson_name">Tên khóa học *</label>
                <input
                  type="text"
                  id="lesson_name"
                  name="lesson_name"
                  value={formData.lesson_name}
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="video_url">URL Video</label>
                  <input
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="picture_url">URL Hình ảnh</label>
                  <input
                    type="url"
                    id="picture_url"
                    name="picture_url"
                    value={formData.picture_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
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

export default LessonManagement;
