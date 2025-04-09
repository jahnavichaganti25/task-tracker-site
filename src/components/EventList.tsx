
import React from "react";
import { format } from "date-fns";
import { Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  attended: boolean;
  completed: boolean;
}

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, field: string) => void;
}

const EventList = ({ events, onEdit, onDelete, onToggleStatus }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No events found. Click "Add Event" to create your first event.</p>
      </div>
    );
  }

  const isPastEvent = (date: string) => {
    if (!date) return false;
    const eventDate = new Date(date);
    return eventDate < new Date();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead className="w-24 text-center">Attended</TableHead>
            <TableHead className="w-24 text-center">Missed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const pastEvent = isPastEvent(event.date);
            
            return (
              <TableRow 
                key={event.id}
                className={cn(
                  "transition-colors",
                  event.attended && "bg-green-50 hover:bg-green-100/70 dark:bg-green-900/20 dark:hover:bg-green-900/30",
                  event.completed && "bg-amber-50 hover:bg-amber-100/70 dark:bg-amber-900/20 dark:hover:bg-amber-900/30"
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {event.title}
                    {pastEvent && !event.attended && !event.completed && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-200 text-amber-800 rounded-full">
                              Past
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This event is in the past but hasn't been marked attended or missed</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{event.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1 text-sm">
                    {event.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {event.time && (
                      <div className="flex items-center gap-1 ml-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {!event.date && !event.time && 'Not set'}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={event.attended} 
                            onCheckedChange={() => onToggleStatus(event.id, 'attended')} 
                            className={cn("transition-all", 
                              event.attended && "text-green-500 border-green-500 bg-green-50 dark:bg-green-900/20"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as {event.attended ? "not attended" : "attended"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={event.completed} 
                            onCheckedChange={() => onToggleStatus(event.id, 'completed')} 
                            className={cn("transition-all", 
                              event.completed && "text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as {event.completed ? "not missed" : "missed"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEdit(event)}
                          className="hover:bg-secondary/80 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onDelete(event.id)}
                          className="hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventList;
