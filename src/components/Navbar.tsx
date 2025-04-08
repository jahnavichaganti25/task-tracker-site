
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  CheckSquare, 
  BarChart, 
  LogOut, 
  User,
  Menu as MenuIcon
} from "lucide-react";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
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

  const navItems = [
    { path: "/tasks", label: "Tasks", icon: <CheckSquare className="h-4 w-4 mr-2" /> },
    { path: "/events", label: "Events", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { path: "/progress", label: "Progress", icon: <BarChart className="h-4 w-4 mr-2" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="py-4 px-6 md:px-10 flex items-center justify-between bg-background border-b sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">Task Tracker</h1>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <>
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle({
                          className: `flex items-center ${isActive(item.path) ? 'bg-accent text-accent-foreground' : ''}`,
                        })}
                      >
                        {item.icon}
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.username || user.email} />
                <AvatarFallback>{user.user_metadata.username ? getInitials(user.user_metadata.username) : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-1">
                <LogOut className="h-4 w-4 mr-1" /> 
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="default" size="sm">Sign In</Button>
          </Link>
        )}
      </div>
      
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[240px]">
          <div className="flex flex-col h-full">
            <div className="py-4 border-b">
              <Link to="/" className="flex items-center gap-2 mb-4" onClick={() => setIsOpen(false)}>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold">Task Tracker</h1>
              </Link>
              {user && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.username || user.email} />
                    <AvatarFallback>{user.user_metadata.username ? getInitials(user.user_metadata.username) : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {user.user_metadata.username || user.email}
                  </span>
                </div>
              )}
            </div>
            
            {user ? (
              <div className="flex-1 py-4 flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-2 py-3 text-sm ${
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    } rounded-md mb-1`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mt-4"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 py-4 flex flex-col">
                <Link
                  to="/auth"
                  className="flex items-center px-2 py-3 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
