import React from 'react';
import { useRole } from '../../hooks/useRole';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const { userRole } = useRole();
  
  // Don't show header for admin pages
  const showHeader = userRole !== 'admin';
  const isAdmin = userRole === 'admin';

  return (
    <div className={`layout ${isAdmin ? 'admin-layout' : ''}`}>
      {isAdmin ? <AdminSidebar /> : <Sidebar />}
      <div className={`layout-content ${isAdmin ? 'admin-content' : ''}`}>
        {showHeader && <Header />}
        <main className={`main-content ${!showHeader ? 'no-header' : ''} ${isAdmin ? 'admin-main' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
