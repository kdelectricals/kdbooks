"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";

export default function CreateInvoice() {
  type Customer = {
    customerID: any;
    id: number;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    company?: string;
    address?: string;
  };

  type Item = {
    itemName: string;
    quantity: number;
    rate: number;
    total: number;
  };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<Item[]>([{ itemName: "", quantity: 1, rate: 0, total: 0 }]);
  const [cgst, setCgst] = useState(9);
  const [sgst, setSgst] = useState(9);
  const [igst, setIgst] = useState(0);
  const [terms, setTerms] = useState("");
  const [invoiceId, setInvoiceId] = useState<number | undefined>(undefined);
  const [reference, setReference] = useState<string>("");

  // Fetch customers
  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data: Customer[]) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  const handleCustomerChange = (event: any, newValue: Customer | null) => {
    setSelectedCustomer(newValue);
  };

  const addItem = () => {
    setItems([...items, { itemName: "", quantity: 1, rate: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantity" || field === "rate") {
      newItems[index].total = newItems[index].quantity * newItems[index].rate;
    }
    setItems(newItems);
  };

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const cgstAmount = (subTotal * cgst) / 100;
  const sgstAmount = (subTotal * sgst) / 100;
  const igstAmount = (subTotal * igst) / 100;
  const grandTotal = subTotal + cgstAmount + sgstAmount + igstAmount;

  const handleSubmit = async () => {
    try {
      if (!selectedCustomer) {
        alert("⚠ Please select a customer.");
        return;
      }
  
      if (items.length === 0 || items.some((item) => item.itemName.trim() === "")) {
        alert("⚠ Please add at least one valid item.");
        return;
      }
  
      // ✅ Ensure customerId is included
      console.log("🔹 Selected Customer:", selectedCustomer);
  
      const invoiceData = {
        invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceDate: new Date().toISOString().split("T")[0],
        customerId: selectedCustomer?.customerID,  // ✅ Ensure customerId is included
        reference: reference || "",
        items: items.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          rate: item.rate,
          total: item.total,
        })),
        total: Math.round(subTotal + cgstAmount + sgstAmount + igstAmount), // ✅ Ensure total is included
      };
  
      console.log("🔹 Sending Invoice Data:", JSON.stringify(invoiceData, null, 2));
  
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`🚨 Server Error: ${errorData.message || "Unknown Error"}`);
      }
  
      const data = await res.json();
      alert(`✅ Invoice Created! Invoice ID: ${data.invoice.id}`);
      setInvoiceId(data.invoice.id);
    } catch (error) {
      console.error("❌ Error creating invoice:", error);
      alert(error.message);
    }
  };
  
  

  const handleGeneratePDF = async () => {
    if (!invoiceId) {
      alert("⚠ Please create an invoice first!");
      return;
    }

    try {
      const res = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });

      if (res.ok) {
        const data = await res.json();
        window.open(data.pdfPath, "_blank");
      } else {
        alert("⚠ Failed to generate PDF.");
      }
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      alert("Error occurred while generating PDF.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create Invoice
      </Typography>

      {/* Customer Selection */}
      <Autocomplete
        options={customers}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        value={selectedCustomer}
        onChange={handleCustomerChange}
        renderInput={(params) => <TextField {...params} label="Select Customer" variant="outlined" fullWidth margin="normal" />}
      />

      {/* Items Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField value={item.itemName} onChange={(e) => handleItemChange(index, "itemName", e.target.value)} fullWidth />
              </TableCell>
              <TableCell>
                <TextField type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))} fullWidth />
              </TableCell>
              <TableCell>
                <TextField type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", Number(e.target.value))} fullWidth />
              </TableCell>
              <TableCell>{item.total.toFixed(2)}</TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => removeItem(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Buttons */}
      <Button variant="contained" color="primary" onClick={addItem} sx={{ mt: 2 }}>
        Add Item
      </Button>

      <Button variant="contained" color="success" onClick={handleSubmit} sx={{ mt: 2, ml: 2 }}>
        Save Invoice
      </Button>

      <Button variant="contained" color="secondary" onClick={handleGeneratePDF} sx={{ mt: 2, ml: 2 }}>
        Generate Invoice PDF
      </Button>
    </Container>
  );
}
