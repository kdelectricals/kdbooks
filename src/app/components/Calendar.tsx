"use client";

import { useState } from "react";
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

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface ToDoList {
  date: string;
  tasks: Task[];
}

export default function CalendarComponent() {
  const [toDoLists, setToDoLists] = useState<{ [date: string]: ToDoList }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskText, setTaskText] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Open Dialog on Date Selection
  const handleSelect = (arg: { startStr: string }) => {
    setSelectedDate(arg.startStr);
    setOpen(true);
  };

  // Add Task to the To-Do List
  const handleAddTask = () => {
    if (selectedDate && taskText.trim()) {
      setToDoLists((prev) => {
        const updatedList = prev[selectedDate] || {
          date: selectedDate,
          tasks: [],
        };

        const newTask: Task = {
          id: Date.now().toString(),
          text: taskText,
          completed: false,
        };

        return {
          ...prev,
          [selectedDate]: {
            ...updatedList,
            tasks: [...updatedList.tasks, newTask], // Properly updating tasks
          },
        };
      });
      setTaskText("");
    }
  };

  // Toggle Task Completion
  const toggleTaskCompletion = (taskId: string) => {
    if (selectedDate) {
      setToDoLists((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          tasks: prev[selectedDate].tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        },
      }));
    }
  };

  // Remove Task
  const handleDeleteTask = (taskId: string) => {
    if (selectedDate) {
      setToDoLists((prev) => {
        const updatedTasks = prev[selectedDate].tasks.filter(
          (task) => task.id !== taskId
        );

        if (updatedTasks.length === 0) {
          // If no tasks remain, remove the date entry
          const newLists = { ...prev };
          delete newLists[selectedDate];
          return newLists;
        }

        return {
          ...prev,
          [selectedDate]: {
            ...prev[selectedDate],
            tasks: updatedTasks,
          },
        };
      });
    }
  };

  // Close Dialog and Remove Empty To-Do Lists
  const handleCloseDialog = () => {
    setOpen(false);
  };

// Define fixed colors
const colors = ["red", "orange", "blue", "green", "yellow"];

// Function to get a consistent color based on date
const getColorForDate = (date: string) => {
  const hash = date
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length]; // Cycle through the colors
};
  

  // Prepare events for FullCalendar
  const events = Object.values(toDoLists).map((list) => ({
    id: list.date,
    title: ":) Tasks",
    start: list.date,
    backgroundColor: getColorForDate(list.date), // Assign consistent color per date
    // borderColor: "transparent",
    
  }));

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto", color: "black", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "bold" }}>To-Do Calendar</h2>

      {/* Full Calendar Component */}
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
  eventContent={(eventInfo) => {
    const color = getColorForDate(eventInfo.event.startStr); // Get consistent color
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "gray", // Black background
          color: "white",
          padding: "2px",
          justifyContent: "start",
          paddingLeft:"10px"
        }}
      >
        {/* Small colored square */}
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: color,
            borderRadius: "2px",
            margin : "0px 2px",
          }}
        ></div>
        {/* Task Text */}
        <span style={{fontWeight: 'bold'}}>Tasks</span>
      </div>
    );
  }}
/>





      {/* Task Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "60%",
            borderRadius: "10px",
            background: "#1E1E1E",
            color: "#fff",
            padding: "10px",
            marginLeft: "250px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            paddingBottom: "10px",
          }}
        >
          My to-do List
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "20px" }}>
          <List sx={{ maxHeight: "300px", overflowY: "auto", }}>
            {selectedDate && toDoLists[selectedDate]?.tasks.length > 0 ? (
              toDoLists[selectedDate]?.tasks.map(task => (
                <ListItem
                  key={task.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      sx={{
                        color: "#4CAF50",
                        "&.Mui-checked": { color: "#4CAF50" },
                      }}
                    />
                    <ListItemText
                      primary={task.text}
                      sx={{
                        textDecoration: task.completed ? "line-through" : "none",
                        fontSize: "1.1rem",
                        color: task.completed ? "#888" : "#fff",
                      }}
                    />
                  </div>
                  <Button onClick={() => handleDeleteTask(task.id)} color="success" size="small">
                    <Delete />
                  </Button>
                </ListItem>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#777" }}>No tasks yet! Add some below.</p>
            )}
          </List>

          {/* Input with Add Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#222",
              borderRadius: "8px",
              padding: "5px 10px",
              marginTop: "15px",
            }}
          >
            <TextField
              placeholder="New Task..."
              fullWidth
              variant="standard"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "#fff", fontSize: "1rem" },
                "& .MuiInput-underline:before": { borderBottom: "1px solid rgba(255, 255, 255, 0.3)" },
              }}
            />
            <Button
              onClick={handleAddTask}
              variant="contained"
              sx={{
                textTransform: "none",
                padding: "10px 20px",
                fontWeight: "bold",
                background: "#4CAF50",
                borderRadius: "8px",
              }}
              disabled={!taskText.trim()}
            >
              <Add/>
            </Button>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  );
}
