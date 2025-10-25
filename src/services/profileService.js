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
    console.log('🌐 [ProfileService] Bắt đầu cập nhật profile:', {
      userId,
      updateData: profileData,
      endpoint: `${this.baseUrl}/${userId}`,
      timestamp: new Date().toISOString()
    });

    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      console.log('📡 [ProfileService] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [ProfileService] API Error:', {
          status: response.status,
          error: errorData,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorData.message || 'Cập nhật hồ sơ thất bại');
      }

      const updatedUser = await response.json();
      
      console.log('✅ [ProfileService] Cập nhật profile thành công:', {
        userId,
        updatedFields: Object.keys(profileData),
        newUserData: updatedUser,
        timestamp: new Date().toISOString()
      });
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('💾 [ProfileService] Đã cập nhật localStorage');
      
      return updatedUser;
    } catch (error) {
      console.error('❌ [ProfileService] Lỗi khi cập nhật profile:', {
        userId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
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
    console.log('📸 [ProfileService] Bắt đầu upload ảnh:', {
      userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      endpoint: `${this.baseUrl}/${userId}/picture`,
      timestamp: new Date().toISOString()
    });

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

      console.log('📡 [ProfileService] Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [ProfileService] Upload API Error:', {
          status: response.status,
          error: errorData,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorData.message || 'Tải lên ảnh đại diện thất bại');
      }

      const result = await response.json();
      
      console.log('✅ [ProfileService] Upload ảnh thành công:', {
        userId,
        newPictureUrl: result.picture,
        timestamp: new Date().toISOString()
      });
      
      // Update localStorage with new picture URL
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.picture = result.picture;
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 [ProfileService] Đã cập nhật localStorage với ảnh mới');
      
      return result;
    } catch (error) {
      console.error('❌ [ProfileService] Lỗi khi upload ảnh:', {
        userId,
        fileName: file.name,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
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
