"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { EventClickArg } from "@fullcalendar/core";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface ToDoList {
  id: number;
  date: string;
  tasks: Task[];
}

export default function CalendarComponent() {
  const [toDoLists, setToDoLists] = useState<{ [date: string]: ToDoList }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskText, setTaskText] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();


  useEffect(() => {
    fetchToDoLists();
  }, []);

const fetchToDoLists = async () => {
  try {
    const response = await axios.get(`/api/todo/get?user_id=${session?.user?.id}`);

    const toDoLists = response.data.toDoLists;

    // Merge tasks by date
    const mergedToDoLists = toDoLists.reduce((acc: Record<string, any>, list: any) => {
      if (acc[list.date]) {
        acc[list.date].tasks.push(...list.tasks);
      } else {
        acc[list.date] = { ...list };
      }
      return acc;
    }, {});

    setToDoLists(mergedToDoLists);
  } catch (error) {
    console.error("Error fetching to-do lists", error);
  }
};
  const handleSelect = (arg: { startStr: string }) => {
    setSelectedDate(arg.startStr);
    setOpen(true);
  };

  const handleAddTask = async () => {
    if (selectedDate && taskText.trim()) {
      try {
        const response = await axios.post("/api/todo/create", {
          user_id : session?.user.id,
          date: selectedDate,
          tasks: [{ text: taskText }],
        });
        fetchToDoLists();
        setTaskText("");
      } catch (error) {
        console.error("Error adding task", error);
      }
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      await axios.put("/api/todo/update-task", { taskId, completed: !toDoLists[selectedDate!].tasks.find(t => t.id === taskId)?.completed });
      fetchToDoLists();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete("/api/todo/delete-task", { data: { taskId } });
      fetchToDoLists();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };


  const events = Object.values(toDoLists)
  .filter(list => list.tasks.length > 0) // Only include dates that have tasks
  .map((list) => {
    const totalTasks = list.tasks.length;
    const completedTasks = list.tasks.filter(task => task.completed).length;

    // Determine color based on completion status
    let eventColor = "red"; // Default: No tasks completed
    if (completedTasks > 0 && completedTasks < totalTasks) {
      eventColor = "orange"; // Some tasks completed
    } else if (completedTasks === totalTasks) {
      eventColor = "green"; // All tasks completed
    }

    return {
      id: list.id.toString(),
      title: "Tasks",
      start: list.date,
      backgroundColor: eventColor,
    };
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto", color: "black", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "bold" }}>To-Do Calendar</h2>

      <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events}
  selectable={true}
  select={handleSelect}
  eventClick={(clickInfo: EventClickArg) => {
    setSelectedDate(clickInfo.event.startStr);
    setOpen(true);
  }}
  height="auto"

  // Make the whole date box interactive
  dayCellDidMount={(arg) => {
    arg.el.style.cursor = "pointer"; // Change cursor to pointer
    arg.el.style.transition = "transform 0.2s ease-in-in"; // Smooth animation

    // Add hover effect
    arg.el.addEventListener("mouseenter", () => {
      arg.el.style.transform = "scale(1.05)";
      arg.el.style.boxShadow = "0px 4px 10px rgba(255, 255, 255, 0.2)"; // Light shadow effect
    });
    arg.el.addEventListener("mouseleave", () => {
      arg.el.style.transform = "scale(1)";
      arg.el.style.boxShadow = "none"; // Reset shadow
    });
  }}
  
  eventContent={(eventInfo) => (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      backgroundColor: "black", 
      color: "white", 
      padding: "5px", 
      borderRadius: "4px",
    }}>
      {/* Small colored circle */}
      <span 
        style={{ 
          width: "15px", 
          height: "15px", 
          backgroundColor: eventInfo.event.backgroundColor, 
          display: "inline-block", 
          marginRight: "5px", 
          borderRadius: "50%", // This makes it a circle!
        }} 
      />
      {eventInfo.event.title}
    </div>
  )}
/>






<Dialog 
  open={open} 
  onClose={handleCloseDialog} 
  fullWidth 
  maxWidth="sm"
  PaperProps={{
    style: { 
      backgroundColor: "#121212", 
      color: "white", 
      borderRadius: "12px", 
      padding: "20px", 
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)", 
      marginLeft: "250px"
    }
  }}
>
  <DialogTitle 
    style={{
      fontSize: "1.2rem", 
      fontWeight: "bold", 
      textAlign: "left",
      paddingBottom: "10px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
    }}
  >
    My Tasks for {selectedDate}
  </DialogTitle>

  <DialogContent>
    <List>
      {selectedDate && toDoLists[selectedDate]?.tasks.length > 0 ? (
        toDoLists[selectedDate]?.tasks.map(task => (
          <ListItem 
            key={task.id} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "8px 0",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <Checkbox 
              checked={task.completed} 
              onChange={() => toggleTaskCompletion(task.id)}
              style={{ color: task.completed ? "#4CAF50" : "white" }}
            />
            <ListItemText 
              primary={task.text} 
              primaryTypographyProps={{
                style: { 
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#bbb" : "white"
                }
              }}
            />
            <Button 
              onClick={() => handleDeleteTask(task.id)} 
              style={{ color: "red" }}
            >
              <Delete />
            </Button>
          </ListItem>
        ))
      ) : (
        <p style={{ textAlign: "center", opacity: 0.7 }}>No tasks yet! Add some below.</p>
      )}
    </List>

    {/* Input for adding new tasks */}
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        marginTop: "15px", 
        borderTop: "1px solid rgba(255, 255, 255, 0.1)", 
        paddingTop: "10px"
      }}
    >
      <TextField 
        placeholder="New Task..." 
        fullWidth 
        value={taskText} 
        onChange={(e) => setTaskText(e.target.value)}
        InputProps={{
          style: { color: "white", borderColor: "white" }
        }}
        style={{ flex: 1, marginRight: "10px" }}
      />
      <Button 
        onClick={handleAddTask} 
        variant="contained" 
        disabled={!taskText.trim()} 
        style={{ 
          backgroundColor: "#4CAF50", 
          color: "white", 
          borderRadius: "8px", 
          padding: "8px 15px"
        }}
      >
        <Add />
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
}