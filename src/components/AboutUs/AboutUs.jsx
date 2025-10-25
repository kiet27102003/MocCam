import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="about-title">ABOUT US</h2>
        <div className="about-description">
          <p>
            Wav.E was founded with the mission of ensuring the comprehensive and sustainable 
            development of the traditional musical instrument application. We focus on building 
            and optimizing every process related to product development — from research, design, 
            and technology development to marketing and customer care.
          </p>
        </div>
        <div className="about-image-placeholder">{/* Placeholder */}</div>
        <div className="about-logo"><h3>WAV.E</h3></div>
      </div>
    </section>
  );
};

export default AboutUs;
