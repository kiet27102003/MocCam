import React from 'react';
import './EmployeeTasks.css';

const EmployeeTasks = () => {
  return (
    <div className="employee-tasks">
      <div className="tasks-header">
        <h1>Nhiệm vụ</h1>
        <p>Quản lý và theo dõi các nhiệm vụ được giao</p>
      </div>
      
      <div className="coming-soon">
        <div className="coming-soon-icon">📋</div>
        <h2>Chức năng đang được phát triển</h2>
        <p>Trang quản lý nhiệm vụ sẽ sớm có mặt với đầy đủ tính năng:</p>
        <ul>
          <li>Xem danh sách nhiệm vụ được giao</li>
          <li>Cập nhật tiến độ nhiệm vụ</li>
          <li>Báo cáo hoàn thành nhiệm vụ</li>
          <li>Nhận thông báo nhiệm vụ mới</li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeTasks;
