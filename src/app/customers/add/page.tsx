"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";

export default function AddCustomer() {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    company: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors: any = {};

    // Required field validation
    ["firstName", "lastName", "contact", "email"].forEach((field) => {
      if (!customer[field as keyof typeof customer].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        valid = false;
      }
    });

    // Email format validation
    if (customer.email && !/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (!res.ok) throw new Error("Failed to add customer");

      setMessage({ text: "Customer added successfully!", type: "success" });
      setCustomer({ firstName: "", lastName: "", contact: "", email: "", company: "", address: "" });
    } catch (err) {
      setMessage({ text: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" fontWeight="bold" textAlign="center" marginY={3}>
        Add New Customer
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
              required
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={customer.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
              required
            />
          </Grid>

          {/* Contact */}
          <Grid item xs={12}>
            <TextField
              label="Contact"
              name="contact"
              value={customer.contact}
              onChange={handleChange}
              error={!!errors.contact}
              helperText={errors.contact}
              fullWidth
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={customer.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
          </Grid>

          {/* Company Name */}
          <Grid item xs={12}>
            <TextField
              label="Company"
              name="company"
              value={customer.company}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={customer.address}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, py: 1.5, width: "100%" }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Add Customer"}
        </Button>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar open={!!message.text} autoHideDuration={4000} onClose={() => setMessage({ text: "", type: "success" })}>
        <Alert severity={message.type as "success" | "error"}>{message.text}</Alert>
      </Snackbar>
    </Container>
  );
}
