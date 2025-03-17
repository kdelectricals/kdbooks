"use client";

import { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Save,
  AddCircle,
  ArrowBack,
  ArrowForward,
  MarkunreadOutlined,
  Person,
  PersonOutline,
  Business,
  Assignment,
  Comment,
  FormatListNumberedOutlined,
  Event,
  SupervisorAccount,
  CheckCircle,
  Email,
  Mic,
  Phone,
  Home,
  AttachFileOutlined,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";

interface Customer {
  customerID?: number;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  address: string;
  company_name: string;
  users?: { FirstName?: string };
  status?: string;
}

const StyledTableContainer = styled(Paper)({
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  margin: "0 0", // Center the table
  maxWidth: "auto", // Make the table more comfortable
});

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const DEBOUNCE_DELAY = 200;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState<Customer | null>(null);
  const [editing, setEditing] = useState<{
    id: number | null;
    field: keyof Customer;
  } | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const { data: session, status } = useSession();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>(""); 

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const newCustomerRef = useRef<HTMLTableRowElement | null>(null);
  // Filters for searching
  const [search, setSearch] = useState<{ [key: string]: string }>({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    address: "",
    company_name: "",
  });

   // Debounce effect for search
   useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput); // Update query after delay
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler); // Cleanup on new input
  }, [searchInput]);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/customers?page=${page}&limit=${limit}&search=${searchQuery}`
        );
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [page, limit, searchQuery]);

  // Close new customer section if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        newCustomerRef.current &&
        !newCustomerRef.current.contains(event.target as Node)
      ) {
        setNewCustomer(null);
      }
    }
    if (newCustomer) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newCustomer]);

  const handleAddCustomer = () => {
    setNewCustomer({
      first_name: "",
      last_name: "",
      email: "",
      contact: "",
      address: "",
      company_name: "",
    });
  };

  const handleSaveCustomer = async () => {
    if (!newCustomer?.first_name || !newCustomer?.contact) {
      alert("First Name and Contact are required!");
      return;
    }
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCustomer, user_id: session?.user.id }),
      });
      if (!response.ok) throw new Error("Failed to save customer");
      const savedCustomer = await response.json();
      setCustomers((prev) => [savedCustomer, ...prev]); // Add to top
      setNewCustomer(null);
    } catch (err) {
      console.error("Error saving customer:", err);
      setError("Error saving customer");
      setSnackbarOpen(true);
    }
  };

  const handleDoubleClick = (
    customerID: number | null,
    field: keyof Customer,
    currentValue: string
  ) => {
    setEditing({ id: customerID, field });
    setEditedValue(currentValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(event.target.value);
  };

  const handleBlur = async (customerID: number, field: keyof Customer) => {
    setEditing(null);
    setCustomers((prev) =>
      prev?.map((customer) =>
        customer.customerID === customerID
          ? { ...customer, [field]: editedValue }
          : customer
      )
    );
    try {
      await fetch(`/api/customers/${customerID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: editedValue }),
      });
    } catch (err) {
      console.error("Error updating customer:", err);
      setError("Error updating customer");
      setSnackbarOpen(true);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          circleColor: "#28a745",
        };
      case "Pending":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          circleColor: "#ffc107",
        };
      case "NotCompleted":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          circleColor: "#dc3545",
        };
      default:
        return {
          backgroundColor: "transparent",
          color: "inherit",
          circleColor: "transparent",
        };
    }
  };

  // const handleFilterChange = (field: string, value: string) => {
  //   setFilters((prev) => ({ ...prev, [field]: value.toLowerCase() }));
  // };

  // // Apply filters to customer list
  // const filteredCustomers = customers.filter((customer) =>
  //   Object.keys(filters).every((key) =>
  //     (customer[key as keyof Customer] || "")
  //       .toLocaleString()
  //       .includes(filters[key as keyof typeof filters])
  //   )
  // );

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        paddingInline={7}
      >
        <Typography variant="h5" fontWeight="">
          Customers List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={handleAddCustomer}
        >
          New Customer
        </Button>
      </Box>

      <TableContainer component={StyledTableContainer}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fa9f" }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                <Box display="flex" alignItems="center">
                  <FormatListNumberedOutlined sx={{ mr: 1 }} />
                  Number
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px" alignSelf="start">
                  <Person sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="First Name"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px" >
                  <Person sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Last Name"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>

              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center"width="150px">
                  <Email sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Email"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <Phone sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Contact"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <Home sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Address"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center">
                  <Business sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Company"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <Assignment sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Requirement"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center">
                  <Comment sx={{ mr: 1 }} />
                  <TextField
                    id="filled-textarea"
                    label="Remark"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <Event sx={{ mr: 1 }} />

                  <TextField
                    id="filled-textarea"
                    label="FollowUpDate"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <SupervisorAccount sx={{ mr: 1 }} />
                  Handle By
         
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <CheckCircle sx={{ mr: 1 }} />

                  <TextField
                    id="filled-textarea"
                    label="Status"
                    placeholder="Search"
                    multiline
                    variant="filled"
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <AttachFileOutlined sx={{ mr: 1 }} />
                  Qtn
                </Box>
              </TableCell>
              <TableCell sx={{ paddingLeft: "0px" }}>
                <Box display="flex" alignItems="center" width="150px">
                  <Mic sx={{ mr: 1 }} />
                  Recording
                </Box>
              </TableCell>
            </TableRow>
            <TableRow></TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={14} align="center" >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {newCustomer && (
                  <StyledTableRow ref={newCustomerRef}>
                    <TableCell>New</TableCell>
                    {[
                      "first_name",
                      "last_name",
                      "email",
                      "contact",
                      "address",
                      "company_name",
                      "requirement",
                      "remark",
                      "follow_up_date",
                      "Handle By",
                      "status",
                      "quotations",
                      "recordings",
                    ].map((field) => (
                      <TableCell key={field}>
                        {field !== "Handle By" && field !== "status" && (
                          <TextField
                            size="small"
                            value={newCustomer[field as keyof Customer] || ""}
                            onChange={(e) =>
                              setNewCustomer({
                                ...newCustomer,
                                [field]: e.target.value,
                              })
                            }
                            autoFocus={field === "first_name"}
                          />
                        )}
                      </TableCell>
                    ))}

                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={handleSaveCustomer}
                        startIcon={<Save />}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                )}
                {customers?.map((customer, index) => (
                  <StyledTableRow key={customer.customerID}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    {[
                      "first_name",
                      "last_name",
                      "email",
                      "contact",
                      "address",
                      "company_name",
                      "requirement",
                      "remark",
                      "follow_up_date",
                      "Handle By",
                      "status",
                      "quotations",
                      "recordings",
                    ].map((field) => (
                      <TableCell
                        key={field}
                        onDoubleClick={() =>
                          handleDoubleClick(
                            customer.customerID!,
                            field as keyof Customer,
                            String(customer[field as keyof Customer] ?? "")
                          )
                        }
                        sx={{
                          minWidth: 150,
                          padding: "8px",
                          backgroundColor:
                            field === "status"
                              ? getStatusStyles(customer?.status ?? "")
                              : "inherit",
                        }}
                      >
                        {editing?.id === customer.customerID &&
                        editing?.field === field ? (
                          <TextField
                            size="small"
                            variant="standard"
                            value={editedValue}
                            onChange={handleChange}
                            onBlur={() =>
                              handleBlur(
                                customer.customerID!,
                                field as keyof Customer
                              )
                            }
                            autoFocus
                            fullWidth
                          />
                        ) : (
                          <span>
                            <>
                              {field === "contct" && <>{customer.contact}</>}
                              {field === "Handle By"
                                ? customer.users?.FirstName
                                : (customer as any)[field]}
                            </>
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        mt={2}
        paddingRight={8}
      >
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          <ArrowBack />
        </Button>
        <Typography sx={{ mx: 2 }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          <ArrowForward />
        </Button>
        <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Rows per page:
          </Typography>
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            variant="outlined"
            size="small"
            sx={{ minWidth: 80 }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
