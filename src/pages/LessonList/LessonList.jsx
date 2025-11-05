import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonApi, courseApi } from "../../config/api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  BookOutlined,
  PlayCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "./LessonList.css";

const LessonList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourseAndLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Load course info
      if (courseId) {
        const courseResponse = await courseApi.getCourseById(courseId);
        setCourse(courseResponse.data);

        // Load lessons by course ID
        const lessonsResponse = await lessonApi.getLessonsByCourse(courseId);
        setLessons(lessonsResponse.data || []);
      }
    } catch (err) {
      console.error("Error loading course and lessons:", err);
      setError("Không thể tải thông tin khóa học và bài học");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseAndLessons();
  }, [loadCourseAndLessons]);

  // Map lesson name to HTML file
  const getLessonHtmlFile = (lessonName) => {
    if (!lessonName) return 'demo5.html';
    
    const name = lessonName.toLowerCase().trim();
    
    // Mapping lesson names to HTML files
    const lessonMap = {
      'trống cơm': 'trongcom.html',
      'bắc kim thang': 'backimthang.html',
      'lý cây bông': 'lycaybong.html',
      'con chim vành khuyên': 'conchimvanhkhuyen.html',
      'thằng cuội': 'thangcuoi.html',
      'giấc mơ trưa': 'giacmotrua.html',
      'tay trái chỉ trăng': 'taytraichitrang.html',
    };
    
    // Check if lesson name matches any key
    for (const [key, file] of Object.entries(lessonMap)) {
      if (name.includes(key) || key.includes(name)) {
        return file;
      }
    }
    
    // Default to demo5.html if no match
    return 'demo5.html';
  };

  const handleSelectLesson = (lesson) => {
    const htmlFile = getLessonHtmlFile(lesson.lesson_name);
    window.open(`/${htmlFile}?lesson=${lesson.lesson_id}`, "_blank");
  };

  const handleBack = () => {
    navigate("/courses");
  };

  return (
    <div className="lesson-list-page">
      <Header />

      <div className="page-content">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeftOutlined /> Quay lại danh sách khóa học
        </button>

        {loading ? (
          <div className="loading-container">
            <LoadingOutlined spin style={{ fontSize: 48, color: "#1890ff" }} />
            <p>Đang tải thông tin...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {course && (
              <div className="course-header">
                <div className="course-header-content">
                  {course.picture_url && (
                    <img
                      src={course.picture_url}
                      alt={course.course_name}
                      className="course-header-image"
                    />
                  )}
                  <div className="course-header-info">
                    <h1 className="course-title">{course.course_name}</h1>
                    {course.description && (
                      <p className="course-header-description">
                        {course.description}
                      </p>
                    )}
                    <div className="course-header-meta">
                      {course.level && (
                        <span className="course-level-badge">
                          {course.level}
                        </span>
                      )}
                      {course.is_free && (
                        <span className="course-free-badge">Miễn phí</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="lessons-section">
              <h2 className="lessons-title">
                <BookOutlined /> Danh sách bài học
              </h2>

              {lessons.length === 0 ? (
                <div className="empty-state">
                  <BookOutlined style={{ fontSize: 64, color: "#ccc" }} />
                  <p>Chưa có bài học nào trong khóa học này</p>
                </div>
              ) : (
                <div className="lessons-grid">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.lesson_id}
                      className="lesson-card"
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      <div className="lesson-number">{index + 1}</div>
                      
                      <div className="lesson-image-container">
                        {lesson.picture_url ? (
                          <img
                            src={lesson.picture_url}
                            alt={lesson.lesson_name}
                            className="lesson-image"
                          />
                        ) : (
                          <div className="lesson-image-placeholder">
                            <VideoCameraOutlined
                              style={{ fontSize: 32, color: "#ccc" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="lesson-content">
                        <h3 className="lesson-name">{lesson.lesson_name}</h3>
                        {lesson.description && (
                          <p className="lesson-description">
                            {lesson.description.length > 100
                              ? `${lesson.description.substring(0, 100)}...`
                              : lesson.description}
                          </p>
                        )}

                        <div className="lesson-meta">
                          {lesson.is_free && (
                            <span className="lesson-free">Miễn phí</span>
                          )}
                        </div>
                      </div>

                      <div className="lesson-footer">
                        <button className="start-lesson-btn">
                          <PlayCircleOutlined /> Bắt đầu học
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LessonList;

