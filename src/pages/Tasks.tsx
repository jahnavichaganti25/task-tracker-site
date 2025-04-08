
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleTaskSaved = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Task deleted",
        description: "Task was successfully deleted",
      });
      
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: currentStatus ? "Task marked incomplete" : "Task marked complete",
      });
      
      fetchTasks();
    } catch (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Tasks</h1>
            <p className="text-muted-foreground">Manage and track your tasks efficiently</p>
          </div>
          <Button 
            onClick={handleAddTask} 
            size="lg" 
            className="shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Task
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-70" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="bg-card/70 backdrop-blur-sm rounded-xl shadow-sm p-6 border">
            <TaskList 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask} 
              onToggleComplete={handleToggleComplete} 
            />
          </div>
        ) : (
          <div className="text-center py-20 bg-card/70 backdrop-blur-sm rounded-xl shadow-sm border">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by adding your first task to keep track of your work.
            </p>
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </div>
        )}

        {isFormOpen && (
          <TaskForm 
            isOpen={isFormOpen} 
            onClose={handleCloseForm} 
            onSave={handleTaskSaved} 
            task={editingTask} 
          />
        )}
      </main>
    </div>
  );
};

export default Tasks;
