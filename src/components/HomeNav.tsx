
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckSquare, Calendar, BarChart, ArrowRight } from "lucide-react";

const HomeNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = [
    {
      title: "Manage Tasks",
      description: "Create, update and track your tasks with our intuitive interface. Set priorities, deadlines, and track progress.",
      icon: <CheckSquare className="h-8 w-8" />,
      path: "/tasks",
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      title: "Track Events",
      description: "Schedule and manage your events efficiently. Never miss important appointments or meetings.",
      icon: <Calendar className="h-8 w-8" />,
      path: "/events",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "View Progress",
      description: "Check your productivity stats and analyze your performance with detailed charts and metrics.",
      icon: <BarChart className="h-8 w-8" />,
      path: "/progress",
      color: "from-emerald-500/20 to-teal-500/20"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Get Started</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Choose from our powerful features to boost your productivity and stay organized
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="bg-card/80 backdrop-blur-sm border rounded-xl overflow-hidden card-hover"
            >
              <div className={`bg-gradient-to-br ${item.color} p-8`}>
                {item.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <Button 
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-center"
                >
                  Go to {item.title.split(" ")[1]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeNav;
