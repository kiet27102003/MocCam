import React, { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const { userRole } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Don't show header for admin pages
  const showHeader = userRole !== 'admin';
  const isAdmin = userRole === 'admin';
  const isCustomer = userRole === 'customer';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`layout ${isAdmin ? 'admin-layout' : ''} ${isCustomer ? 'customer-layout' : ''}`}>
      {isAdmin ? (
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
          isMobile={isMobile}
        />
      ) : isCustomer ? (
        <CustomerSidebar 
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
          isMobile={isMobile}
        />
      ) : (
        <Sidebar />
      )}
      <div className={`layout-content ${isAdmin ? 'admin-content' : ''} ${isCustomer ? 'customer-content' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {showHeader && <Header />}
        <main className={`main-content ${!showHeader ? 'no-header' : ''} ${isAdmin ? 'admin-main' : ''} ${isCustomer ? 'customer-main' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
