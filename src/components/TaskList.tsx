
import React from "react";
import { format } from "date-fns";
import { Edit, Trash2, Check, X } from "lucide-react";
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

interface Task {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
}

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No tasks found. Click "Add Task" to create your first task.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className={task.completed ? "bg-muted/30" : ""}>
              <TableCell>
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => onToggleComplete(task.id, task.completed)} 
                />
              </TableCell>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">{task.description}</div>
              </TableCell>
              <TableCell>
                {task.start_date ? format(new Date(task.start_date), 'MMM dd, yyyy HH:mm') : 'Not set'}
              </TableCell>
              <TableCell>
                {task.end_date ? format(new Date(task.end_date), 'MMM dd, yyyy HH:mm') : 'Not set'}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(task.id)}>
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

export default TaskList;
