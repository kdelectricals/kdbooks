"use client";  // ✅ Ensures this runs on the client

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow, Paper, Button, CircularProgress, Box 
} from "@mui/material";


export default function CustomersPage() {
  const [customers, setCustomers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // ✅ Prevent memory leaks

    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        if (isMounted) setCustomers(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCustomers();

    return () => { isMounted = false; }; // Cleanup function
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Customers
        </Typography>
        <Link href="/customers/add" passHref>
          <Button variant="contained" color="primary">
            Add Customer
          </Button>
        </Link>
      </Box>

      {error && (
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer: any) => (
                  <TableRow key={customer.customerID}>
                    <TableCell>{customer.customerID}</TableCell>
                    <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.contact}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
