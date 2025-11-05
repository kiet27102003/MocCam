import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseApi } from "../../config/api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { BookOutlined, PlayCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import "./CourseSelect.css";

const CourseSelect = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await courseApi.getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (courseId) => {
    navigate(`/courses/${courseId}/lessons`);
  };

  return (
    <div className="course-select-page">
      <Header />
      
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Chọn Khóa Học</h1>
          <p className="page-subtitle">
            Chọn khóa học để bắt đầu học tập và khám phá các bài học
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <LoadingOutlined spin style={{ fontSize: 48, color: "#1890ff" }} />
            <p>Đang tải danh sách khóa học...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <BookOutlined style={{ fontSize: 64, color: "#ccc" }} />
            <p>Chưa có khóa học nào</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="course-card"
                onClick={() => handleSelectCourse(course.course_id)}
              >
                <div className="course-image-container">
                  {course.picture_url ? (
                    <img
                      src={course.picture_url}
                      alt={course.course_name}
                      className="course-image"
                    />
                  ) : (
                    <div className="course-image-placeholder">
                      <BookOutlined style={{ fontSize: 48, color: "#ccc" }} />
                    </div>
                  )}
                </div>
                
                <div className="course-content">
                  <h3 className="course-name">{course.course_name}</h3>
                  {course.description && (
                    <p className="course-description">
                      {course.description.length > 100
                        ? `${course.description.substring(0, 100)}...`
                        : course.description}
                    </p>
                  )}
                  
                  <div className="course-meta">
                    {course.level && (
                      <span className="course-level">{course.level}</span>
                    )}
                    {course.is_free ? (
                      <span className="course-free">Miễn phí</span>
                    ) : (
                      <span className="course-paid">
                        {course.price && course.price > 0 
                          ? `${course.price.toLocaleString('vi-VN')} đ` 
                          : 'Có phí'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="course-footer">
                  <button className="select-course-btn">
                    <PlayCircleOutlined /> Chọn khóa học
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CourseSelect;

