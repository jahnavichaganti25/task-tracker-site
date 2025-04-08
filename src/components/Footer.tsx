
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            <span className="font-medium">React App</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {currentYear} React App. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
