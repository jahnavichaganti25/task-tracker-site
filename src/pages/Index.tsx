
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HomeNav />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
