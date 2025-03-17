"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
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
  const { data: session } = useSession();



  const fetchToDoLists = useCallback(async () => {
    try {
      if (!session?.user?.id) return; // Avoid calling API if user is not available

      const response = await axios.get(`/api/todo/get?user_id=${session.user.id}`);
      const toDoLists = response.data.toDoLists;

      // Merge tasks by date
      const mergedToDoLists = toDoLists.reduce(
        (acc: Record<string, any>, list: any) => {
          if (acc[list.date]) {
            acc[list.date].tasks.push(...list.tasks);
          } else {
            acc[list.date] = { ...list };
          }
          return acc;
        },
        {}
      );

      setToDoLists(mergedToDoLists);
    } catch (error) {
      console.error("Error fetching to-do lists", error);
    }
  }, [session?.user?.id]); // ✅ Dependencies: function only changes when `session.user.id` changes


  useEffect(() => {
    fetchToDoLists();
  }, [fetchToDoLists]); // Runs when fetchToDoLists changes



  const handleSelect = (arg: { startStr: string }) => {
    setSelectedDate(arg.startStr);
    setOpen(true);
  };

  const handleAddTask = async () => {
    if (selectedDate && taskText.trim()) {
      try {
         await axios.post("/api/todo/create", {
          user_id: session?.user.id,
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
      await axios.put("/api/todo/update-task", {
        taskId,
        completed: !toDoLists[selectedDate!].tasks.find((t) => t.id === taskId)
          ?.completed,
      });
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
  const specialDays = [
    { title: "KD Eletricals 3rd anniversary ", date: "2025-03-15", color: "#f00" },
    // International Special Days
    { title: "New Year's Day", date: "2025-01-01", color: "#f00" },
    { title: "Valentine's Day", date: "2025-02-14", color: "#f00" },
    { title: "International Women's Day", date: "2025-03-08", color: "#f00" },
    { title: "Earth Day", date: "2025-04-22", color: "#f00" },
    { title: "World Environment Day", date: "2025-06-05", color: "#f00" },
    { title: "International Yoga Day", date: "2025-06-21", color: "#f00" },
    { title: "Friendship Day", date: "2025-08-03", color: "#f00" }, // First Sunday of August
    { title: "World Literacy Day", date: "2025-09-08", color: "#f00" },
    { title: "World Food Day", date: "2025-10-16", color: "#f00" },
    { title: "Children's Day (Universal)", date: "2025-11-20", color: "#f00" },
    { title: "Christmas", date: "2025-12-25", color: "#f00" },
  
    // Indian Special Days
    { title: "Republic Day (India)", date: "2025-01-26", color: "#f00" },
    { title: "Holi", date: "2025-03-14", color: "#f00" }, // Varies each year
    { title: "Ram Navami", date: "2025-04-06", color: "#f00" }, // Varies each year
    { title: "Mahavir Jayanti", date: "2025-04-10", color: "#f00" }, // Varies each year
    { title: "Good Friday", date: "2025-04-18", color: "#f00" }, // Varies each year
    { title: "Eid al-Fitr", date: "2025-03-31", color: "#f00" }, // Varies each year
    { title: "Independence Day (India)", date: "2025-08-15", color: "#f00" },
    { title: "Raksha Bandhan", date: "2025-08-09", color: "#f00" }, // Varies each year
    { title: "Ganesh Chaturthi", date: "2025-08-27", color: "#f00" }, // Varies each year
    { title: "Gandhi Jayanti / Dussehra", date: "2025-10-02", color: "#f00" },

    { title: "Diwali", date: "2025-10-21", color: "#f00" }, // Varies each year
    { title: "Guru Nanak Jayanti", date: "2025-11-15", color: "#f00" }, // Varies each year
  
    // Maharashtra Special Days
    { title: "Maharashtra Day / Labour Day", date: "2025-05-01", color: "#f00" },
    { title: "Gudi Padwa", date: "2025-03-30", color: "#f00" }, // Marathi New Year, varies each year
    { title: "Shivaji Maharaj Jayanti", date: "2025-02-19", color: "#f00" },
    { title: "Ambedkar Jayanti", date: "2025-04-14", color: "#f00" },
    { title: "Ashadhi Ekadashi", date: "2025-07-07", color: "#f00" }, // Pandharpur Wari festival, varies each year
    { title: "Guru Purnima", date: "2025-07-11", color: "#f00" }, // Varies each year
    { title: "Dahi Handi (Janmashtami)", date: "2025-08-16", color: "#f00" }, // Celebrated across Maharashtra
    { title: "Ganesh Visarjan", date: "2025-09-06", color: "#f00" }, // End of Ganesh Chaturthi, varies each year
    { title: "Navratri Begins / International Peace Day", date: "2025-09-21", color: "#f00" }, // First day of Navratri, varies each year
    { title: "Lakshmi Pujan (Diwali)", date: "2025-10-20", color: "#f00" }, // Diwali special day in Maharashtra
    { title: "Bhau Beej", date: "2025-10-23", color: "#f00" }, // Marathi version of Bhai Dooj
  ];
  
  const events = [
    ...Object.values(toDoLists).map((list) => ({
      id: list.id.toString(),
      title: "Tasks",
      start: list.date,
      backgroundColor:
        list.tasks.every((task) => task.completed) ? "green" : "red",
    })),
    ...specialDays.map((day, index) => ({
      id: `special-${index}`,
      title: day.title,
      start: day.date,
      backgroundColor: day.color,
      textColor: "white",
      display: "background", // Makes it a full-day highlight
    })),
  ];



  return (
    <div
      style={{

        maxWidth: "auto",
        margin: "auto",
        color: "black",
        minHeight: "auto",
      }}
    >
      <h2
        style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "bold" }}
      >
        To-Do Calendar
      </h2>

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
        eventContent={(eventInfo) => {
          const isSpecialDay = specialDays.some((day) => day.title === eventInfo.event.title);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: isSpecialDay ? eventInfo.event.backgroundColor : "black",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
                fontWeight: isSpecialDay ? "bold" : "normal",
              }}
            >
              <span
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: eventInfo.event.backgroundColor,
                  display: "inline-block",
                  marginRight: "5px",
                  borderRadius: "50%",
                }}
              />
              <span style={{fontSize: '12px'}} > {eventInfo.event.title}</span>
             
            </div>
          );
        }}
        
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
            marginLeft: "250px",
          },
        }}
      >
        <DialogTitle
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "left",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          My Tasks for {selectedDate}
        </DialogTitle>

        <DialogContent>
          <List>
            {selectedDate && toDoLists[selectedDate]?.tasks.length > 0 ? (
              toDoLists[selectedDate]?.tasks.map((task) => (
                <ListItem
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed ? "#bbb" : "white",
                      },
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
              <p style={{ textAlign: "center", opacity: 0.7 }}>
                No tasks yet! Add some below.
              </p>
            )}
          </List>

          {/* Input for adding new tasks */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "15px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "10px",
            }}
          >
            <TextField
              placeholder="New Task..."
              fullWidth
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              InputProps={{
                style: { color: "white", borderColor: "white" },
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
                padding: "8px 15px",
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
