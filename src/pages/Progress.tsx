
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const ProgressPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    completionRate: 0,
  });
  const [eventStats, setEventStats] = useState({
    total: 0,
    attended: 0,
    completed: 0,
    attendanceRate: 0,
    completionRate: 0,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select('*');
      
      if (tasksError) throw tasksError;
      
      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select('*');
      
      if (eventsError) throw eventsError;
      
      // Calculate task stats
      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(task => task.completed)?.length || 0;
      
      setTaskStats({
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      });
      
      // Calculate event stats
      const totalEvents = events?.length || 0;
      const attendedEvents = events?.filter(event => event.attended)?.length || 0;
      const completedEvents = events?.filter(event => event.completed)?.length || 0;
      
      setEventStats({
        total: totalEvents,
        attended: attendedEvents,
        completed: completedEvents,
        attendanceRate: totalEvents > 0 ? (attendedEvents / totalEvents) * 100 : 0,
        completionRate: totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0,
      });
    } catch (error) {
      toast({
        title: "Error fetching statistics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Progress Tracking</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Tasks Completed</span>
                      <span className="text-sm font-medium">{Math.round(taskStats.completionRate)}%</span>
                    </div>
                    <Progress value={taskStats.completionRate} className="h-2" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {taskStats.completed} of {taskStats.total} tasks completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Event Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Events Attended</span>
                      <span className="text-sm font-medium">{Math.round(eventStats.attendanceRate)}%</span>
                    </div>
                    <Progress value={eventStats.attendanceRate} className="h-2" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {eventStats.attended} of {eventStats.total} events attended
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Events Completed</span>
                      <span className="text-sm font-medium">{Math.round(eventStats.completionRate)}%</span>
                    </div>
                    <Progress value={eventStats.completionRate} className="h-2" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {eventStats.completed} of {eventStats.total} events completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressPage;
