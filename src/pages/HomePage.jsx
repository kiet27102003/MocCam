import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Quote from "../components/Quote/Quote";
import AboutUs from "../components/AboutUs/AboutUs";
import GoalsVisionMission from "../components/Vision/GoalsVisionMission";
import Footer from "../components/Footer/Footer";

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Quote />
      <AboutUs />
      <GoalsVisionMission />
      <Footer />
    </>
  );
};

export default HomePage;
