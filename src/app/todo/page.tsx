"use client";

import { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, List, ListItem, IconButton } from "@mui/material";
import { Delete, CalendarToday } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

export default function TodoPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState({});

  const handleAddTask = () => {
    if (!selectedDate || !task.trim()) return;
    const dateKey = selectedDate.toISOString().split("T")[0];

    setTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), task],
    }));
    setTask("");
  };

  const handleDeleteTask = (date, index) => {
    setTasks((prev) => ({
      ...prev,
      [date]: prev[date].filter((_, i) => i !== index),
    }));
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", p: 3, mt: 5 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          To-Do List
        </Typography>
        
        {/* Date Picker */}
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
        />
        
        {/* Task Input */}
        <TextField
          label="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        
        {/* Add Button */}
        <Button variant="contained" color="primary" onClick={handleAddTask} fullWidth>
          Add Task
        </Button>

        {/* Task List */}
        {Object.keys(tasks).map((date) => (
          <div key={date}>
            <Typography variant="h6" sx={{ mt: 3, color: "primary.main" }}>
              📅 {date}
            </Typography>
            <List>
              {tasks[date].map((t, index) => (
                <ListItem key={index} secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleDeleteTask(date, index)}>
                    <Delete />
                  </IconButton>
                }>
                  {t}
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
