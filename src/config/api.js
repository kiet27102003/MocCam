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
  USER_GET: '/users/:id',
  USER_UPDATE: '/users/:id',
  
  // Voucher endpoints
  VOUCHERS: '/vouchers',
  VOUCHER_CHECK: '/vouchers/check',
  VOUCHER_CREATE: '/vouchers/create',

  // Subcription endpoints

  SUBSCRIPTIONS: '/subscription-plans',
  SUBSCRIPTIONS_ACTIVE: '/subscription-plans/active',
  SUBSCRIPTION_DETAIL: '/subscription-plans/{id}',
  SUBSCRIPTION_CREATE: '/subscription-plans/create',
  SUBSCRIPTION_UPDATE: '/subscription-plans/update/{id}',
  SUBSCRIPTION_DELETE: '/subscription-plans/{id}',

  // Lesson endpoints
  LESSONS: '/lessons',
  LESSON_CREATE: '/lessons/create',
  LESSON_DETAIL: '/lessons/{id}',
  LESSON_UPDATE: '/lessons/{id}',
  LESSON_DELETE: '/lessons/{id}',

  // Course endpoints
  COURSES: '/courses',
  
  // AI Model endpoints
  AI_MODELS: '/ai-models',
  
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
  getLessonsByCourse(courseId) {
    return axiosClient.get(`/lessons/course/${courseId}`);
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

// AI Model API functions
export const aiModelApi = {
  // Lấy danh sách
  getAIModels() {
    return axiosClient.get("/ai-models");
  },

  // Lấy chi tiết
  getAIModelById(id) {
    return axiosClient.get(`/ai-models/${id}`);
  },

  // Thêm mới (admin/employee)
  createAIModel(data) {
    return axiosClient.post("/ai-models/create", data);
  },

  // Cập nhật
  updateAIModel(id, data) {
    return axiosClient.put(`/ai-models/${id}`, data);
  },

  // Xóa
  deleteAIModel(id) {
    return axiosClient.delete(`/ai-models/${id}`);
  }
};

// User API functions
export const userApi = {
  // Lấy thông tin user theo ID
  getUserById(id) {
    return axiosClient.get(`/users/${id}`);
  },

  // Cập nhật thông tin user
  updateUser(id, data) {
    return axiosClient.put(`/users/${id}`, data);
  },

  // Tạo user mới
  createUser(data) {
    return axiosClient.post("/users/create", data);
  }
};

// Subscription API functions
export const subscriptionApi = {
  // Lấy tất cả gói đăng ký
  getAllSubscriptions() {
    return axiosClient.get("/subscription-plans");
  },

  // Lấy các gói đang hoạt động (dùng cho mọi người xem)
  getActiveSubscriptions() {
    return axiosClient.get("/subscription-plans/active");
  },

  // Lấy chi tiết gói đăng ký theo ID
  getSubscriptionById(id) {
    return axiosClient.get(`/subscription-plans/${id}`);
  },

  // Tạo gói đăng ký mới
  createSubscription(data) {
    return axiosClient.post("/subscription-plans/create", data);
  },

  // Cập nhật gói đăng ký
  updateSubscription(id, data) {
    return axiosClient.put(`/subscription-plans/update/${id}`, data);
  },

  // Xóa gói đăng ký
  deleteSubscription(id) {
    return axiosClient.delete(`/subscription-plans/${id}`);
  }
};