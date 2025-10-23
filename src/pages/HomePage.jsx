import React from "react";
import HomeHeader from "../components/HomeHeader/HomeHeader";
import Hero from "../components/Hero/Hero";
import Quote from "../components/Quote/Quote";
import AboutUs from "../components/AboutUs/AboutUs";
import GoalsVisionMission from "../components/Vision/GoalsVisionMission";
import Footer from "../components/Footer/Footer";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-layout">
      <HomeHeader />
      <main className="homepage-main">
        <Hero />
        <Quote />
        <AboutUs />
        <GoalsVisionMission />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
