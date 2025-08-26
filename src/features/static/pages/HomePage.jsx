import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      <Header />
      <section>
        <HeroSection />
        <IntroSection />
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
