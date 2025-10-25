import React from "react";
import "./Setting.css";

const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h3 className="modal-title">Cài đặt</h3>

        <div className="settings-group">
          <label>Âm lượng</label>
          <input type="range" min="0" max="100" defaultValue="70" />
        </div>

        <div className="settings-group">
          <label>SFX</label>
          <input type="range" min="0" max="100" defaultValue="60" />
        </div>

        <button className="btn-exit" onClick={onClose}>
          Thoát
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
