import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import './ProtectedRoute.css';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallbackPath = '/login',
  showUnauthorized = true 
}) => {
  const { userRole, hasPermission, hasRole, isLoading } = useRole();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!userRole) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    if (showUnauthorized) {
      return (
        <div className="unauthorized-container">
          <div className="unauthorized-content">
            <h1>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <p>Vai trò yêu cầu: <strong>{requiredRole}</strong></p>
            <p>Vai trò hiện tại: <strong>{userRole}</strong></p>
            <button onClick={() => window.history.back()}>
              Quay lại
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to="/home" replace />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (showUnauthorized) {
      return (
        <div className="unauthorized-container">
          <div className="unauthorized-content">
            <h1>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền thực hiện hành động này.</p>
            <p>Quyền yêu cầu: <strong>{requiredPermission}</strong></p>
            <button onClick={() => window.history.back()}>
              Quay lại
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to="/home" replace />;
  }

  // All checks passed, render the protected content
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Component for conditional rendering based on role
export const RoleBasedRender = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallback = null 
}) => {
  const { hasRole, hasPermission } = useRole();

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;
