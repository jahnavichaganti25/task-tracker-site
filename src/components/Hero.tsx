
import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Welcome to Your New React Application
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            A clean, modern starting point for your next amazing project. Build
            something beautiful with React.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="animate-fade-in">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="animate-fade-in">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-full h-64 md:h-96 -z-10 opacity-20">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
        <div className="absolute right-64 bottom-10 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hero;
