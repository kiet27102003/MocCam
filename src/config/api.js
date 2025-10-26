// Import axios client for API calls
import axios from 'axios';

// API configuration for different environments
const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs that go through the Vite proxy
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // In development, you can choose between proxy or direct localhost
  // Using proxy for consistency across environments
  return '/api';
  
  // Alternative for development with direct localhost access:
  // return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiBaseUrl();
console.log('🌐 API_BASE_URL configured as:', API_BASE_URL);

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  GOOGLE_LOGIN: '/auth/google-login',
  REGISTER: '/auth/register/customer',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User endpoints
  USERS: '/users',
  USER_CREATE: '/users/create',
  USER_UPDATE: '/users/:id',
  USER_PICTURE: '/users/:id/picture',
  USER_PASSWORD: '/users/:id/password',
  
  // Voucher endpoints
  VOUCHERS: '/vouchers',
  VOUCHER_CHECK: '/vouchers/check',
  VOUCHER_CREATE: '/vouchers/create',

  // Subcription endpoints
  SUBSCRIPTIONS: '/subscription-plans',
  SUBSCRIPTION_CREATE: '/subscription-plans/create',
  SUBSCRIPTION_DETAIL: '/subscription-plans/{id}',
  SUBSCRIPTION_UPDATE: '/subscription-plans/update/{id}',

  // Lesson endpoints
  LESSONS: '/lessons',
  LESSON_CREATE: '/lessons/create',
  LESSON_DETAIL: '/lessons/{id}',
  LESSON_UPDATE: '/lessons/{id}',
  LESSON_DELETE: '/lessons/{id}',

  // Course endpoints
  COURSES: '/courses',
  
  // Payment endpoints
  PAYMENTS: '/payments',
  PAYMENT_CREATE: '/payments/payos/create',
  
  // Notification endpoints
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_CREATE: '/notifications/create',

  // Dashboard endpoints
  DASHBOARD_USER_STATS_BY_MONTH: '/dashboard/user-stats-by-month',
  DASHBOARD_VOUCHER_STATS_BY_MONTH: '/dashboard/voucher-stats-by-month',
  DASHBOARD_REVENUE_STATS_BY_MONTH: '/dashboard/revenue-stats-by-month',
  DASHBOARD_LESSON_STATS_BY_MONTH: '/dashboard/lesson-stats-by-month',
  
};

// Helper to get full endpoint URL
export const getEndpointUrl = (endpoint, params = {}) => {
  let url = createApiUrl(API_ENDPOINTS[endpoint] || endpoint);
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Create axios instance with base configuration
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Lesson API functions
export const lessonApi = {
  ping() {
    return axiosClient.get("/lessons/ping");
  },

  getAllLessons() {
    return axiosClient.get("/lessons");
  },

  getLessonById(id) {
    return axiosClient.get(`/lessons/${id}`);
  },

  createLesson(data) {
    return axiosClient.post("/lessons/create", data);
  },

  updateLesson(id, data) {
    return axiosClient.put(`/lessons/${id}`, data);
  },

  deleteLesson(id) {
    return axiosClient.delete(`/lessons/${id}`);
  },

  // Additional lesson APIs
  getLessonsByCourse(courseId) {
    return axiosClient.get(`/lessons/course/${courseId}`);
  },

  getLessonsByInstrument(instrument) {
    return axiosClient.get(`/lessons/instrument/${instrument}`);
  },

  getLessonsByDifficulty(difficulty) {
    return axiosClient.get(`/lessons/difficulty/${difficulty}`);
  },

  searchLessons(query) {
    return axiosClient.get(`/lessons/search?q=${encodeURIComponent(query)}`);
  },

  getLessonProgress(userId, lessonId) {
    return axiosClient.get(`/lessons/${lessonId}/progress/${userId}`);
  },

  updateLessonProgress(userId, lessonId, progress) {
    return axiosClient.post(`/lessons/${lessonId}/progress/${userId}`, progress);
  },

  getPopularLessons(limit = 10) {
    return axiosClient.get(`/lessons/popular?limit=${limit}`);
  },

  getRecentLessons(limit = 10) {
    return axiosClient.get(`/lessons/recent?limit=${limit}`);
  }
};

// Course API functions
export const courseApi = {
  getAllCourses() {
    return axiosClient.get("/courses");
  },

  getCourseById(id) {
    return axiosClient.get(`/courses/${id}`);
  },

  createCourse(data) {
    return axiosClient.post("/courses/create", data);
  },

  updateCourse(id, data) {
    return axiosClient.put(`/courses/${id}`, data);
  },

  deleteCourse(id) {
    return axiosClient.delete(`/courses/${id}`);
  }
};
