
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { user } = useAuth();

  return (
    <div className="relative py-24 md:py-32 lg:py-40 px-6 md:px-10 flex flex-col items-center text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-repeat pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-block mb-6">
          <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary rounded-full py-1.5 pl-2 pr-3 font-medium">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">NEW</span>
            <span>Task Tracker 2.0 is now available</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-3xl mx-auto mb-8">
          Manage Tasks Effectively with{" "}
          <span className="gradient-text">
            Task Tracker
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Stay organized, track your progress, and boost productivity with our 
          simple yet powerful task management system.
        </p>
        
        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
              <Link to="/tasks">
                View Your Tasks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link to="/events">Manage Events</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
              <Link to="/auth">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        )}
        
        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold gradient-text">3x</div>
            <p className="text-muted-foreground mt-1">More Productive</p>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">10k+</div>
            <p className="text-muted-foreground mt-1">Active Users</p>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">99%</div>
            <p className="text-muted-foreground mt-1">Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
