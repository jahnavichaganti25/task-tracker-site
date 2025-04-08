
import React from "react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead className="w-24 text-center">Attended</TableHead>
            <TableHead className="w-24 text-center">Completed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">{event.description}</div>
              </TableCell>
              <TableCell>
                {event.date && event.time 
                  ? `${format(new Date(event.date), 'MMM dd, yyyy')} at ${event.time}`
                  : 'Not set'
                }
              </TableCell>
              <TableCell className="text-center">
                <Checkbox 
                  checked={event.attended} 
                  onCheckedChange={() => onToggleStatus(event.id, 'attended')} 
                  className="mx-auto"
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox 
                  checked={event.completed} 
                  onCheckedChange={() => onToggleStatus(event.id, 'completed')} 
                  className="mx-auto"
                />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(event.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventList;
