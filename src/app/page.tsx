"use client"
import { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { AccountCircle, Receipt, Storefront, CurrencyRupeeSharp } from "@mui/icons-material";

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, invoices: 0, sales: 0, orders: 0 });

  useEffect(() => {
    // Fetch stats from API (Replace with your actual API endpoint)
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const dashboardItems = [
    { label: "Customers", value: stats.customers, icon: <AccountCircle fontSize="large" color="primary" /> },
    { label: "Invoices", value: stats.invoices, icon: <Receipt fontSize="large" color="secondary" /> },
    { label: "Total Sales", value: `Rs ${stats.sales}`, icon: <CurrencyRupeeSharp fontSize="large" color="success" /> },
    { label: "Orders", value: stats.orders, icon: <Storefront fontSize="large" color="warning" /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Welcome to KD Dashboard
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Box display="flex" justifyContent="center" mb={1}>{item.icon}</Box>
                <Typography variant="h6" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}