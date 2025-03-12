"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Container, Typography, Box, Button, CircularProgress, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  TableContainer, Paper, IconButton 
} from "@mui/material";
import { styled } from "@mui/system";
import { MoreVert, BorderColor } from "@mui/icons-material";

interface Customer {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
}

const StyledTableContainer = styled(Paper)({
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
});

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data: Customer[] = await response.json();
        if (isMounted) setCustomers(data);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Customers
        </Typography>
        <Link href="/customers/add" passHref>
          <Button variant="contained" sx={{ borderRadius: "8px" }}>Add Customer</Button>
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
        <TableContainer component={StyledTableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <StyledTableRow key={customer.customerID}>
                    <TableCell>{customer.customerID}</TableCell>
                    <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.contact}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <IconButton>
                        <BorderColor/>
                      </IconButton>
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}