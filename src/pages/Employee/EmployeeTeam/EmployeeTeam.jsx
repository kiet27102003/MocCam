import React from 'react';
import './EmployeeTeam.css';

const EmployeeTeam = () => {
  return (
    <div className="employee-team">
      <div className="team-header">
        <h1>Đội ngũ</h1>
        <p>Thông tin về đội ngũ giảng dạy và hỗ trợ</p>
      </div>
      
      <div className="coming-soon">
        <div className="coming-soon-icon">👥</div>
        <h2>Chức năng đang được phát triển</h2>
        <p>Trang quản lý đội ngũ sẽ sớm có mặt với đầy đủ tính năng:</p>
        <ul>
          <li>Xem danh sách thành viên đội ngũ</li>
          <li>Thông tin liên hệ và chuyên môn</li>
          <li>Lịch làm việc và phân công nhiệm vụ</li>
          <li>Đánh giá hiệu suất làm việc</li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeTeam;
