
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import EventForm from "@/components/EventForm";

const Events = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      // Using a type assertion to bypass TypeScript's strictness
      const { data, error } = await supabase
        .from("events")
        .select('*')
        .order('date', { ascending: true }) as any;
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast({
        title: "Error fetching events",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleEventSaved = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    try {
      // Using a type assertion to bypass TypeScript's strictness
      const { error } = await supabase
        .from("events")
        .delete()
        .eq('id', id) as any;
      
      if (error) throw error;
      
      toast({
        title: "Event deleted",
        description: "Event was successfully deleted",
      });
      
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id, field) => {
    try {
      const event = events.find(e => e.id === id);
      
      if (!event) return;
      
      const updates = {};
      updates[field] = !event[field];
      
      // Using a type assertion to bypass TypeScript's strictness
      const { error } = await supabase
        .from("events")
        .update(updates)
        .eq('id', id) as any;
      
      if (error) throw error;
      
      toast({
        title: `Event marked as ${field === 'attended' ? (event.attended ? 'not attended' : 'attended') : (event.completed ? 'not completed' : 'completed')}`,
      });
      
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error updating event",
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
          <h1 className="text-2xl font-bold">Events</h1>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <EventList 
            events={events} 
            onEdit={handleEditEvent} 
            onDelete={handleDeleteEvent} 
            onToggleStatus={handleToggleStatus} 
          />
        )}

        {isFormOpen && (
          <EventForm 
            isOpen={isFormOpen} 
            onClose={handleCloseForm} 
            onSave={handleEventSaved} 
            event={editingEvent} 
          />
        )}
      </main>
    </div>
  );
};

export default Events;
