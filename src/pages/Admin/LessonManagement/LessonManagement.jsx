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
  FileImageOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { lessonApi, courseApi } from "../../../config/api";
import "./LessonManagement.css";

const LessonManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterType, setFilterType] = useState("");

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
      const response = await lessonApi.getAllLessons();
      setLessons(response.data);
      setFilteredLessons(response.data);
    } catch (err) {
      setError("Không thể tải danh sách bài học");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await courseApi.getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Không thể tải danh sách khóa học");
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
        await lessonApi.updateLesson(editingLesson.lesson_id, payload);
        setSuccess("Cập nhật bài học thành công!");
      } else {
        await lessonApi.createLesson(payload);
        setSuccess("Tạo bài học thành công!");
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
    if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;
    try {
      setLoading(true);
      await lessonApi.deleteLesson(id);
      setSuccess("Xóa bài học thành công!");
      loadLessons();
    } catch (err) {
      setError("Không thể xóa bài học.");
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
      // hour: '2-digit',
      // minute: '2-digit'
    });
  };

  // Search and filter functions
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredLessons(lessons);
      return;
    }
    
    try {
      setLoading(true);
      const response = await lessonApi.searchLessons(searchQuery);
      setFilteredLessons(response.data);
    } catch (err) {
      console.error("Search error:", err);
      // Fallback to client-side search
      const filtered = lessons.filter(lesson =>
        lesson.lesson_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLessons(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = [...lessons];

    if (filterInstrument) {
      filtered = filtered.filter(lesson => 
        lesson.instrument === filterInstrument
      );
    }

    if (filterDifficulty) {
      filtered = filtered.filter(lesson => 
        lesson.difficulty === filterDifficulty
      );
    }

    if (filterType) {
      filtered = filtered.filter(lesson => 
        filterType === 'free' ? lesson.is_free : !lesson.is_free
      );
    }

    setFilteredLessons(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterInstrument("");
    setFilterDifficulty("");
    setFilterType("");
    setFilteredLessons(lessons);
  };

  // Effect to apply filters when they change
  useEffect(() => {
    handleFilter();
  }, [filterInstrument, filterDifficulty, filterType, lessons]);

  return (
    <div className="lesson-management">
      <div className="lesson-header">
        <h1>Quản lý Bài Học</h1>
        <div className="header-actions">
          <button className="reload-btn" onClick={loadLessons} title="Làm mới">
            <ReloadOutlined />
          </button>
          <button className="create-btn" onClick={handleOpenCreate}>
            <PlusOutlined /> Tạo bài học mới
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm bài học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <SearchOutlined />
          </button>
        </div>

        <div className="filter-controls">
          <select
            value={filterInstrument}
            onChange={(e) => setFilterInstrument(e.target.value)}
          >
            <option value="">Tất cả nhạc cụ</option>
            <option value="dantranh">Đàn Tranh</option>
            <option value="dannguyet">Đàn Nguyệt</option>
            <option value="tyba">Đàn Tỳ Bà</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">Tất cả độ khó</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung bình</option>
            <option value="advanced">Nâng cao</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Tất cả loại</option>
            <option value="free">Miễn phí</option>
            <option value="paid">Trả phí</option>
          </select>

          <button className="clear-filters-btn" onClick={clearFilters}>
            <FilterOutlined /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="lesson-stats">
        <div className="stat-card">
          <h3>Tổng bài học</h3>
          <span className="stat-number">{lessons.length}</span>
        </div>
        <div className="stat-card">
          <h3>Bài học miễn phí</h3>
          <span className="stat-number">
            {lessons.filter(l => l.is_free).length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Bài học trả phí</h3>
          <span className="stat-number">
            {lessons.filter(l => !l.is_free).length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Kết quả tìm kiếm</h3>
          <span className="stat-number">{filteredLessons.length}</span>
        </div>
      </div>

      <div className="lesson-table-container">
        <table className="lesson-table">
          <thead>
            <tr>
              <th>Tên bài học</th>
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
            ) : filteredLessons.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">Không tìm thấy bài học nào</td>
              </tr>
            ) : (
              filteredLessons.map(lesson => {
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
                      <div className="action-buttons-wrapper">
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
          <div className="modal-content create-lesson-modal">
            <div className="modal-header">
              <h2>
                <PlusOutlined />
                {isEditing ? "Chỉnh sửa bài học" : "Tạo bài học mới"}
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
                <label htmlFor="lesson_name">Tên bài học *</label>
                <input
                  type="text"
                  id="lesson_name"
                  name="lesson_name"
                  value={formData.lesson_name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên bài học"
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
                  placeholder="Nhập mô tả bài học"
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
                  Bài học miễn phí
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
