
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Calendar, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import EventForm from "@/components/EventForm";
import CalendarView from "@/components/CalendarView";

const Events = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
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
        title: `Event marked as ${field === 'attended' ? (event.attended ? 'not attended' : 'attended') : (event.completed ? 'not missed' : 'missed')}`,
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Events</h1>
            <p className="text-muted-foreground">Schedule and manage your upcoming events</p>
          </div>
          <div className="flex items-center space-x-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="hidden md:flex"
            >
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" /> List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Calendar View
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              onClick={handleAddEvent} 
              size="lg"
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-5 w-5" /> Add New Event
            </Button>
          </div>
        </div>
        
        {/* Mobile tabs */}
        <div className="mb-6 md:hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="list" className="flex items-center gap-2 w-full">
                <List className="h-4 w-4" /> List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2 w-full">
                <Calendar className="h-4 w-4" /> Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-70" />
          </div>
        ) : (
          <div className="bg-card/70 backdrop-blur-sm rounded-xl shadow-sm p-6 border">
            {/* Wrap the TabsContent components within the Tabs component */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="list" className="mt-0">
                <EventList 
                  events={events} 
                  onEdit={handleEditEvent} 
                  onDelete={handleDeleteEvent} 
                  onToggleStatus={handleToggleStatus} 
                />
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <CalendarView 
                  events={events} 
                  onEventSelect={handleEditEvent} 
                />
              </TabsContent>
            </Tabs>
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
