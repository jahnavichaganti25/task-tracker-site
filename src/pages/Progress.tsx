
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

const ProgressDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    tasks: { total: 0, completed: 0 },
    events: { total: 0, attended: 0, completed: 0 },
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
      
      // Fetch tasks stats
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select('*');
      
      if (tasksError) throw tasksError;
      
      // Fetch events stats
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select('*');
      
      if (eventsError) throw eventsError;
      
      setStats({
        tasks: {
          total: tasks?.length || 0,
          completed: tasks?.filter(task => task.completed).length || 0,
        },
        events: {
          total: events?.length || 0,
          attended: events?.filter(event => event.attended).length || 0,
          completed: events?.filter(event => event.completed).length || 0,
        }
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

  const taskCompletionRate = stats.tasks.total > 0 
    ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) 
    : 0;
  
  const eventAttendanceRate = stats.events.total > 0 
    ? Math.round((stats.events.attended / stats.events.total) * 100) 
    : 0;
  
  const eventCompletionRate = stats.events.total > 0 
    ? Math.round((stats.events.completed / stats.events.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Progress Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Tasks
              </CardTitle>
              <CardDescription>
                Task completion progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="font-medium">{stats.tasks.completed} / {stats.tasks.total}</span>
                </div>
                <Progress value={taskCompletionRate} />
                <div className="text-center text-sm text-muted-foreground">
                  {taskCompletionRate}% complete
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Event Attendance
              </CardTitle>
              <CardDescription>
                Events you've attended
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Attended</span>
                  <span className="font-medium">{stats.events.attended} / {stats.events.total}</span>
                </div>
                <Progress value={eventAttendanceRate} />
                <div className="text-center text-sm text-muted-foreground">
                  {eventAttendanceRate}% attended
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="h-5 w-5" /> Event Completion
              </CardTitle>
              <CardDescription>
                Events you've completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="font-medium">{stats.events.completed} / {stats.events.total}</span>
                </div>
                <Progress value={eventCompletionRate} />
                <div className="text-center text-sm text-muted-foreground">
                  {eventCompletionRate}% completed
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks Summary</TabsTrigger>
            <TabsTrigger value="events">Events Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Breakdown</CardTitle>
                <CardDescription>
                  Overview of your task completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{stats.tasks.completed}</span>
                      <span className="text-sm text-muted-foreground">Completed</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{stats.tasks.total - stats.tasks.completed}</span>
                      <span className="text-sm text-muted-foreground">Pending</span>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {stats.tasks.total === 0 ? (
                      <p>No tasks added yet. Start by creating your first task!</p>
                    ) : (
                      <p>You've completed {taskCompletionRate}% of your tasks.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Breakdown</CardTitle>
                <CardDescription>
                  Overview of your event participation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{stats.events.attended}</span>
                      <span className="text-sm text-muted-foreground">Attended</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{stats.events.completed}</span>
                      <span className="text-sm text-muted-foreground">Completed</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{stats.events.total}</span>
                      <span className="text-sm text-muted-foreground">Total</span>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {stats.events.total === 0 ? (
                      <p>No events added yet. Start by creating your first event!</p>
                    ) : (
                      <p>You've attended {eventAttendanceRate}% of your events and completed {eventCompletionRate}%.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProgressDashboard;
