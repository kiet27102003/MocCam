import React from 'react';
import './GoalsVisionMission.css';

const GoalsVisionMission = () => {
  return (
    <section className="gvm-section">
      <div className="gvm-container">
        <div className="gvm-column">
          <div className="gvm-image">
            <img src="/tranh.png" alt="Đàn Tranh" className="instrument-image" />
          </div>
          <div className="gvm-banner goal-banner">
            <span>GOAL</span>
          </div>
          <div className="gvm-description">
            <p>
              Mộc Cầm aims to rekindle the cultural roots of traditional Vietnamese music 
              through a modern educational technology platform.
            </p>
          </div>
        </div>

        <div className="gvm-column">
          <div className="gvm-image">
            <img src="/nguyệt.png" alt="Đàn Nguyệt" className="instrument-image" />
          </div>
          <div className="gvm-banner vision-banner">
            <span>VISION</span>
          </div>
          <div className="gvm-description">
            <p>
              To become Vietnam's leading edtech platform for traditional musical instruments 
              — a bridge between past and future, between cultural heritage and modern life.
            </p>
          </div>
        </div>

        <div className="gvm-column">
          <div className="gvm-image">
            <img src="/tỳ_bà.png" alt="Tỳ Bà" className="instrument-image" />
          </div>
          <div className="gvm-banner mission-banner">
            <span>MISSION</span>
          </div>
          <div className="gvm-description">
            <p>
              Reviving traditional music through modern, youth-friendly learning. Learning by doing, 
              with AI hand-tracking and AR instruments. Bridging learners and artisans via stories, 
              sounds, and lessons. Living culture, not just preserving it — together in a digital age.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsVisionMission;
