
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Modern React",
      description: "Built with the latest React features and best practices for optimal performance and developer experience.",
      icon: (
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
          className="h-8 w-8"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 19a7 7 0 1 0 0-14" />
        </svg>
      ),
      gradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      title: "TypeScript",
      description: "Type-safe code for better developer experience, enabling fewer bugs and more reliable applications.",
      icon: (
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
          className="h-8 w-8"
        >
          <path d="M16.5 9.4 7.55 4.24" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Tailwind CSS",
      description: "Beautiful, responsive design with utility-first CSS for rapid UI development and consistent styling.",
      icon: (
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
          className="h-8 w-8"
        >
          <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
        </svg>
      ),
      gradient: "from-emerald-500/10 to-teal-500/10"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-secondary/30 to-background py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
          Everything You Need
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Our application is built with modern technologies to provide the best possible experience
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="overflow-hidden border shadow-sm card-hover bg-card/80 backdrop-blur-sm"
            >
              <div className={`bg-gradient-to-br ${feature.gradient} p-8`}>
                {feature.icon}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
