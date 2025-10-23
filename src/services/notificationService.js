import { API_BASE_URL } from '../config/api.js';

export const notificationService = {
  // Tạo thông báo mới
  createNotification: async (notificationData) => {
    try {
      console.log('🔵 notificationService.createNotification called with:', notificationData);
      const token = localStorage.getItem('token');
      console.log('🔑 Token available:', !!token);
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const url = `${API_BASE_URL}/notifications/create`;
      console.log('🌐 API URL:', url);
      
      const requestBody = JSON.stringify(notificationData);
      console.log('📤 Request body (stringified):', requestBody);
      console.log('📤 Request body (object):', notificationData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: requestBody
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Không thể tạo thông báo: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  },

  // Lấy danh sách thông báo
  getNotifications: async (params = {}) => {
    try {
      console.log('🔵 notificationService.getNotifications called with params:', params);
      const token = localStorage.getItem('token');
      console.log('🔑 Token available:', !!token);
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const queryParams = new URLSearchParams(params);
      const url = `${API_BASE_URL}/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 API URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Không thể lấy danh sách thông báo: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái thông báo
  updateNotification: async (notificationId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể cập nhật thông báo: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  // Xóa thông báo
  deleteNotification: async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể xóa thông báo: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Lấy danh sách người dùng để gửi thông báo
  getUsers: async () => {
    try {
      console.log('🔵 notificationService.getUsers called');
      const token = localStorage.getItem('token');
      console.log('🔑 Token available:', !!token);
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const url = `${API_BASE_URL}/users`;
      console.log('🌐 API URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Không thể lấy danh sách người dùng: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    try {
      console.log('🔵 notificationService.markAllAsRead called');
      const token = localStorage.getItem('token');
      console.log('🔑 Token available:', !!token);
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const url = `${API_BASE_URL}/notifications/mark-all-read`;
      console.log('🌐 API URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Không thể đánh dấu tất cả đã đọc: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw error;
    }
  }
};
