
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  task?: any;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

const TaskForm = ({ isOpen, onClose, onSave, task }: TaskFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("12:00");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      start_date: task?.start_date ? new Date(task.start_date) : undefined,
      end_date: task?.end_date ? new Date(task.end_date) : undefined,
    },
  });

  useEffect(() => {
    if (task) {
      if (task.start_date) {
        const startDate = new Date(task.start_date);
        form.setValue("start_date", startDate);
        setStartTime(
          `${String(startDate.getHours()).padStart(2, "0")}:${String(
            startDate.getMinutes()
          ).padStart(2, "0")}`
        );
      }
      
      if (task.end_date) {
        const endDate = new Date(task.end_date);
        form.setValue("end_date", endDate);
        setEndTime(
          `${String(endDate.getHours()).padStart(2, "0")}:${String(
            endDate.getMinutes()
          ).padStart(2, "0")}`
        );
      }
    }
  }, [task, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const startDate = values.start_date;
      const endDate = values.end_date;
      
      // Combine date with time
      let finalStartDate = undefined;
      let finalEndDate = undefined;
      
      if (startDate) {
        const [hours, minutes] = startTime.split(":").map(Number);
        finalStartDate = new Date(startDate);
        finalStartDate.setHours(hours, minutes);
      }
      
      if (endDate) {
        const [hours, minutes] = endTime.split(":").map(Number);
        finalEndDate = new Date(endDate);
        finalEndDate.setHours(hours, minutes);
      }

      const taskData = {
        title: values.title,
        description: values.description || "",
        start_date: finalStartDate,
        end_date: finalEndDate,
        user_id: user.id,
      };

      if (task) {
        // Update existing task - using type assertion
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", task.id) as any;

        if (error) throw error;
        toast({ title: "Task updated successfully" });
      } else {
        // Create new task - using type assertion
        const { error } = await supabase.from("tasks").insert([taskData]) as any;

        if (error) throw error;
        toast({ title: "Task created successfully" });
      }

      onSave();
    } catch (error) {
      toast({
        title: "Error saving task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormControl>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormControl>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{task ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
