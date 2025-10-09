import React from "react";
import "./Sidebar.css";
import { FaBook, FaMusic, FaTrophy, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active = "hocdan", onSelect }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "hocdan", label: "Học đàn", icon: <FaBook />, path: "/dan-tranh" },
    { key: "baihat", label: "Bài hát", icon: <FaMusic />, path: "/song-list" },
    { key: "bangxephang", label: "Bảng xếp hạng", icon: <FaTrophy />, path: "/bangxephang" },
    { key: "hoso", label: "Hồ sơ", icon: <FaUser />, path: "/HoSo" },
  ];

  const handleSelect = (item) => {
    onSelect?.(item.key);
    navigate(item.path); 
  };

  return (
    <aside className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={active === item.key ? "active" : ""}
            onClick={() => handleSelect(item)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
