import { createApiUrl } from '../config/api';

// Service for user profile management
class ProfileService {
  constructor() {
    this.baseUrl = createApiUrl('/users');
  }

  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật hồ sơ thất bại');
      }

      const updatedUser = await response.json();
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lấy thông tin hồ sơ thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      const formData = new FormData();
      formData.append('picture', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/${userId}/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tải lên ảnh đại diện thất bại');
      }

      const result = await response.json();
      
      // Update localStorage with new picture URL
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.picture = result.picture;
      localStorage.setItem('user', JSON.stringify(userData));
      
      return result;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, passwordData) {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đổi mật khẩu thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

export default new ProfileService();
