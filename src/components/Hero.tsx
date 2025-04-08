
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  return (
    <div className="relative py-16 md:py-24 lg:py-32 px-6 md:px-10 flex flex-col items-center text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/0 pointer-events-none" />
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mb-6">
        Manage Tasks Effectively with{" "}
        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Task Tracker
        </span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
        Stay organized, track your progress, and boost productivity with our simple yet powerful task management system.
      </p>
      {user ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link to="/tasks">View Your Tasks</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/tasks/new">Create New Task</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Hero;
