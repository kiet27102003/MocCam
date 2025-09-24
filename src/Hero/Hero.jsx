import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-text">
            <span className="hero-subtitle">WE ARE</span>
            <h1 className="hero-title">MỘC CẦM</h1>
            <p className="hero-description">
              A unique educational app for learning traditional Vietnamese musical instruments, 
              enhanced by AI technology. The software integrates hand movement tracking and 
              sound recognition to provide real-time feedback, helping users improve their 
              technique and accuracy.
            </p>
            <a href="/logo1.png" download className="download-btn">
              <span>DOWNLOAD</span>
              <DownloadOutlined style={{ fontSize: "16px" }} />
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="instruments-container">
            <div className="instrument dan-nguyet">
              <div className="instrument-body">
                <div className="instrument-neck"></div>
                <div className="instrument-head"></div>
                <div className="instrument-strings"></div>
              </div>
            </div>
            
            <div className="instrument dan-tranh">
              <div className="instrument-body">
                <div className="instrument-strings"></div>
                <div className="instrument-bridges"></div>
              </div>
            </div>

            <div className="decoration-elements">
              <div className="music-note note-1">♪</div>
              <div className="music-note note-2">♫</div>
              <div className="music-note note-3">♪</div>
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
