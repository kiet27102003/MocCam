import React from 'react';
import './GoalsVisionMission.css';

const GoalsVisionMission = () => {
  return (
    <section className="gvm-section">
      <div className="gvm-container">
        <div className="gvm-column">
          <div className="gvm-image">
            <div className="instrument-placeholder dan-tranh-placeholder">
              <div className="instrument-body">
                <div className="instrument-strings"></div>
                <div className="instrument-bridges"></div>
              </div>
            </div>
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
            <div className="instrument-placeholder dan-nguyet-placeholder">
              <div className="instrument-body">
                <div className="instrument-neck"></div>
                <div className="instrument-head"></div>
                <div className="instrument-strings"></div>
              </div>
            </div>
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
            <div className="instrument-placeholder dan-tyba-placeholder">
              <div className="instrument-body">
                <div className="instrument-neck"></div>
                <div className="instrument-head"></div>
                <div className="instrument-strings"></div>
              </div>
            </div>
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
