import axios from 'axios';
import { API_ENDPOINTS, createApiUrl } from '../config/api.js';

// Service for handling password reset functionality
export const passwordResetService = {
  // Reset password with new password
  resetPassword: async (email, newPassword) => {
    const response = await axios.post(createApiUrl(API_ENDPOINTS.RESET_PASSWORD), {
      email: email,
      newPassword: newPassword
    });
    return response.data;
  }
};

export default passwordResetService;
