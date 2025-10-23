import { createApiUrl, API_ENDPOINTS } from '../config/api.js';

// Service functions for subscription plans
export const subscriptionService = {
  // Get all subscription plans
  async getAllPlans() {
    try {
      const url = createApiUrl(API_ENDPOINTS.SUBSCRIPTIONS);
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
        // If unauthorized (401), try without token for public access
        if (response.status === 401) {
          console.log('Unauthorized, trying public access...');
          const publicResponse = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (publicResponse.ok) {
            const data = await publicResponse.json();
            return data;
          }
        }
        
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Get a specific subscription plan by ID
  async getPlanById(id) {
    try {
      const response = await fetch(createApiUrl(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      throw error;
    }
  },

  // Create a new subscription plan (admin only)
  async createPlan(planData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl(API_ENDPOINTS.SUBSCRIPTION_CREATE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw error;
    }
  },

  // Update a subscription plan (admin only)
  async updatePlan(id, planData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      throw error;
    }
  }
};
