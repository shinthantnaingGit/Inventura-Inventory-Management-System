import React from "react";
import Header from "./Header";
import About from "./About";
import Intro from "./Intro";
import Contact from "./Contact";
import Footer from "./Footer";
import Hero from "./Hero";

const StaticSection = () => {
  return (
    <section className="font-sans antialiased text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-20">
        <Hero />
        <About />
        <Intro />
        <Contact />
      </main>
      <Footer />
    </section>
  );
};

export default StaticSection;
