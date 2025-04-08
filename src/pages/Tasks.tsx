
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onEdit={handleEditTask} 
            onDelete={handleDeleteTask} 
            onToggleComplete={handleToggleComplete} 
          />
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
