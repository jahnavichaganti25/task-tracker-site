
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { ChevronRight, Calendar, CheckCircle, XCircle, Loader2, BarChart } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

// Fix: Add proper type definition for the CustomTooltip component
interface CustomTooltipProps extends TooltipProps<any, any> {
  active?: boolean;
  payload?: any[];
  label?: any;
}

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
  const [chartData, setChartData] = useState([]);
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
      const missedEvents = events?.filter(event => event.completed)?.length || 0;
      
      setEventStats({
        total: totalEvents,
        attended: attendedEvents,
        completed: missedEvents,
        attendanceRate: totalEvents > 0 ? (attendedEvents / totalEvents) * 100 : 0,
        completionRate: totalEvents > 0 ? (missedEvents / totalEvents) * 100 : 0,
      });

      // Create chart data
      setChartData([
        { name: 'Tasks', completed: completedTasks, total: totalTasks - completedTasks },
        { name: 'Events', attended: attendedEvents, missed: missedEvents, notTracked: totalEvents - attendedEvents - missedEvents }
      ]);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Progress Tracking</h1>
            <p className="text-muted-foreground">Track your productivity and attendance over time</p>
          </div>
          <button 
            onClick={fetchStats} 
            className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <BarChart size={16} /> Refresh Stats
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-card/70 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{taskStats.completed}</h3>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/70 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{eventStats.attended}</h3>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/70 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <XCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{eventStats.completed}</h3>
                  <p className="text-sm text-muted-foreground">Events Missed</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/70 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    {taskStats.total > 0 ? Math.round(taskStats.completionRate) : 0}%
                  </h3>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card/70 backdrop-blur-sm border shadow-sm">
                <CardHeader>
                  <CardTitle>Task Completion</CardTitle>
                  <CardDescription>Your task completion progress</CardDescription>
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
              
              <Card className="bg-card/70 backdrop-blur-sm border shadow-sm">
                <CardHeader>
                  <CardTitle>Event Progress</CardTitle>
                  <CardDescription>Your event attendance tracking</CardDescription>
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
                        <span className="text-sm font-medium">Events Missed</span>
                        <span className="text-sm font-medium">{Math.round(eventStats.completionRate)}%</span>
                      </div>
                      <Progress value={eventStats.completionRate} className="h-2" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {eventStats.completed} of {eventStats.total} events missed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Data Visualization */}
            <Card className="bg-card/70 backdrop-blur-sm border shadow-sm p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>Visual representation of your progress</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="h-80">
                  <ChartContainer 
                    config={{
                      completed: { label: "Completed", color: "#16a34a" },
                      attended: { label: "Attended", color: "#22c55e" },
                      missed: { label: "Missed", color: "#f97316" },
                      total: { label: "Remaining", color: "#e5e7eb" },
                      notTracked: { label: "Not Tracked", color: "#d1d5db" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" />
                        <Bar dataKey="total" stackId="a" fill="var(--color-total)" />
                        <Bar dataKey="attended" stackId="b" fill="var(--color-attended)" />
                        <Bar dataKey="missed" stackId="b" fill="var(--color-missed)" />
                        <Bar dataKey="notTracked" stackId="b" fill="var(--color-notTracked)" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

// Fix: Update the CustomTooltip component with proper prop types
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-md shadow-md p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => {
          // Skip the entry if the value is 0
          if (entry.value === 0) return null;
          
          return (
            <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3" style={{ backgroundColor: entry.fill }}></div>
              <span>{entry.name}: {entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default ProgressPage;
