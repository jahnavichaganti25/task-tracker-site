
import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="py-4 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
        <h1 className="text-xl font-semibold">React App</h1>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Home
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Features
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          About
        </a>
        <Button variant="outline" size="sm">Get Started</Button>
      </div>
      <Button variant="ghost" size="icon" className="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </Button>
    </nav>
  );
};

export default Navbar;
