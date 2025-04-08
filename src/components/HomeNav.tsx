
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckSquare, Calendar, BarChart } from "lucide-react";

const HomeNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = [
    {
      title: "Manage Tasks",
      description: "Create, update and track your tasks",
      icon: <CheckSquare className="h-6 w-6" />,
      path: "/tasks",
    },
    {
      title: "Track Events",
      description: "Schedule and manage your events",
      icon: <Calendar className="h-6 w-6" />,
      path: "/events",
    },
    {
      title: "View Progress",
      description: "Check your productivity stats",
      icon: <BarChart className="h-6 w-6" />,
      path: "/progress",
    },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="bg-card border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-muted-foreground mb-4 flex-1">
                {item.description}
              </p>
              <Button onClick={() => navigate(item.path)}>Go to {item.title.split(" ")[1]}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeNav;
