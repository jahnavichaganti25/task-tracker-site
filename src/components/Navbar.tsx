
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="py-4 px-6 md:px-10 flex items-center justify-between bg-background border-b">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">Task Tracker</h1>
      </Link>
      
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/tasks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              My Tasks
            </Link>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.username || user.email} />
                <AvatarFallback>{user.user_metadata.username ? getInitials(user.user_metadata.username) : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="default" size="sm">Sign In</Button>
          </Link>
        )}
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
