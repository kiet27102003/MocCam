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
  
  // User endpoints
  USERS: '/users',
  USER_CREATE: '/users/create',
  
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
