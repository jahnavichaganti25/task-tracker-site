
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  attended: boolean;
  completed: boolean;
}

interface CalendarViewProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventSelect }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      if (!event.date) return false;
      return isSameDay(new Date(event.date), date);
    });
  };
  
  // Get events for the currently selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  // Function to determine if a date has events
  const hasEvents = (date: Date) => {
    return events.some(event => {
      if (!event.date) return false;
      return isSameDay(new Date(event.date), date);
    });
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 bg-card/70 backdrop-blur-sm border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Events Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            modifiersStyles={{
              selected: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
              today: {
                backgroundColor: "hsl(var(--accent))",
                color: "hsl(var(--accent-foreground))",
              },
            }}
            modifiers={{
              hasEvents: (date) => hasEvents(date),
            }}
            // Fix for TS2559: Remove the styles prop and use CSS classes instead
            classNames={{
              day_hasEvents: "event-dot",
            }}
          />
          <style jsx>{`
            :global(.event-dot) {
              position: relative;
            }
            :global(.event-dot::after) {
              content: "";
              position: absolute;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: hsl(var(--primary));
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
            }
          `}</style>
        </CardContent>
      </Card>
      
      <Card className="bg-card/70 backdrop-blur-sm border shadow-sm">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </CardTitle>
          <CardDescription>
            {selectedDateEvents.length 
              ? `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled`
              : "No events for this date"}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto">
          {selectedDateEvents.length > 0 ? (
            <ul className="space-y-2">
              {selectedDateEvents.map((event) => (
                <li 
                  key={event.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    event.attended 
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30" 
                      : event.completed 
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30"
                      : "bg-card border-muted hover:bg-accent/20"
                  }`}
                  onClick={() => onEventSelect(event)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">{event.title}</h4>
                    {event.time && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-md">{event.time}</span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {event.attended && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/40 dark:text-green-100">
                        Attended
                      </span>
                    )}
                    {event.completed && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-900/40 dark:text-amber-100">
                        Missed
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            selectedDate && (
              <div className="flex flex-col items-center justify-center text-center h-40">
                <p className="text-muted-foreground mb-3">No events scheduled for this day.</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
