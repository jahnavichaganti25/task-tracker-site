
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Calendar } from "lucide-react";
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
      const { data, error } = await supabase
        .from("events")
        .select('*')
        .order('date', { ascending: true });
      
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
      const { error } = await supabase
        .from("events")
        .delete()
        .eq('id', id);
      
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
      
      const { error } = await supabase
        .from("events")
        .update(updates)
        .eq('id', id);
      
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Events</h1>
            <p className="text-muted-foreground">Schedule and manage your upcoming events</p>
          </div>
          <Button 
            onClick={handleAddEvent} 
            size="lg"
            className="shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Event
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-70" />
          </div>
        ) : events.length > 0 ? (
          <div className="bg-card/70 backdrop-blur-sm rounded-xl shadow-sm p-6 border">
            <EventList 
              events={events} 
              onEdit={handleEditEvent} 
              onDelete={handleDeleteEvent} 
              onToggleStatus={handleToggleStatus} 
            />
          </div>
        ) : (
          <div className="text-center py-20 bg-card/70 backdrop-blur-sm rounded-xl shadow-sm border">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start planning your schedule by adding your first event.
            </p>
            <Button onClick={handleAddEvent}>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </div>
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
