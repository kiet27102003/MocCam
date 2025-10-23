import { createApiUrl, API_ENDPOINTS } from '../config/api.js';

// Service functions for user subscriptions
export const userSubscriptionService = {
  // Get all user subscriptions
  async getAllUserSubscriptions() {
    try {
      const url = createApiUrl('/user-subscriptions');
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  },

  // Get a specific user subscription by ID
  async getUserSubscriptionById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl(`/user-subscriptions/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw error;
    }
  },

  // Cancel a user subscription
  async cancelUserSubscription(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl(`/user-subscriptions/${id}/cancel`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error canceling user subscription:', error);
      throw error;
    }
  }
};
