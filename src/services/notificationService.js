import { API_BASE_URL } from '../config/api.js';

export const notificationService = {
  // Tạo thông báo mới
  createNotification: async (notificationData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể tạo thông báo: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Lấy danh sách thông báo
  getNotifications: async (params = {}) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const queryParams = new URLSearchParams(params);
      const url = `${API_BASE_URL}/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể lấy danh sách thông báo: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể lấy danh sách người dùng: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
};
