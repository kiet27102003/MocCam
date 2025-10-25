import React, { createContext, useState } from 'react';
import { ROLES, PERMISSIONS, ROLE_ROUTES } from '../constants/roleConstants';

// Context
const RoleContext = createContext();

// Provider Component
export const RoleProvider = ({ children }) => {
  // Load user role immediately from localStorage
  const loadInitialRole = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        const role = user.role || ROLES.CUSTOMER;
        return { role, permissions: PERMISSIONS[role] || [] };
      }
    } catch (error) {
      console.error('Error loading user role:', error);
    }
    return { role: null, permissions: [] };
  };

  const { role: initialRole, permissions: initialPermissions } = loadInitialRole();
  const [userRole, setUserRole] = useState(initialRole);
  const [userPermissions, setUserPermissions] = useState(initialPermissions);
  const [isLoading] = useState(false);

  // Update user role and permissions
  const updateUserRole = (role, userData) => {
    try {
      setUserRole(role);
      setUserPermissions(PERMISSIONS[role] || []);
      
      // Update localStorage
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Clear user role (logout)
  const clearUserRole = () => {
    setUserRole(null);
    setUserPermissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  // Get user's available routes
  const getUserRoutes = () => {
    return ROLE_ROUTES[userRole] || [];
  };

  // Get default route for user role
  const getDefaultRoute = () => {
    const routes = getUserRoutes();
    return routes.length > 0 ? routes[0].path : '/home';
  };

  const value = {
    userRole,
    userPermissions,
    isLoading,
    updateUserRole,
    clearUserRole,
    hasPermission,
    hasRole,
    hasAnyRole,
    getUserRoutes,
    getDefaultRoute
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
