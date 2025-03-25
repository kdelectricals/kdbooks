"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Stack,
  Grid,
  TableContainer
} from "@mui/material";
import {  Delete } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function CreateInvoice() {
  type Buyer = {
    customerID: any;
    id: number;
    first_name: string;
    last_name: string;
    contact: string;
    email: string;
    company?: string;
    address?: string;
  };

  type Item = {
    itemName: string;
    quantity: number;
    unit: string;
    hsn: string;
    rate: number;
    discount: number; // in percentage
    discountedRate: number;
    total: number;
  };

  const [customers, setCustomers] = useState<Buyer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Buyer | null>(null);
  const [items, setItems] = useState<Item[]>([
    { itemName: "", quantity: 1, unit: "", hsn: "", rate: 0, discount: 0, discountedRate: 0, total: 0 },
  ]);
  const [cgst, setCgst] = useState(9);
  const [sgst, setSgst] = useState(9);
  const [igst, setIgst] = useState(0);
  const [terms, setTerms] = useState("");
  const [invoiceId, setInvoiceId] = useState<number | undefined>(undefined);
  const [reference, setReference] = useState<string>("");
  const [openPreview, setOpenPreview] = useState(false);


  useEffect(() => {
    fetch("/api/buyers")
      .then((res) => res.json())
      .then((data: { data: Buyer[] }) => setCustomers(data.data))
      .catch((err) => console.error("Error fetching customers:", err));
      setCgst(9);
      setSgst(9) ;
      setIgst(0);
      setReference("");
  }, []);

  const handleCustomerChange = (event: any, newValue: Buyer | null) => {
    setSelectedCustomer(newValue);
  };

  const addItem = () => {
    setItems([...items, { itemName: "", quantity: 1, unit: "", hsn: "", rate: 0, discount: 0, discountedRate: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handlePreviewOpen = () => {
    if (!selectedCustomer) {
      alert("⚠ Please select a customer.");
      return;
    }
    if (items.length === 0 || items.some((item) => item.itemName.trim() === "")) {
      alert("⚠ Please add at least one valid item.");
      return;
    }
    setOpenPreview(true);
  };
  
  // const handlePreviewClose = () => {
  //   setOpenPreview(false);
  // };
  

  const handleItemChange = <K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K] // ✅ Ensures value matches the expected type
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
  
    // ✅ Ensure calculations only run for numeric fields
    if (field === "quantity" || field === "rate" || field === "discount") {
      const rate = newItems[index].rate || 0;
      const discount = newItems[index].discount || 0;
      const quantity = newItems[index].quantity || 0;
  
      const discountedRate = rate - (rate * discount) / 100;
      const total = quantity * discountedRate;
  
      newItems[index].discountedRate = discountedRate;
      newItems[index].total = total;
    }
  
    setItems(newItems);
  };
  

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const cgstAmount = (subTotal * cgst) / 100;
  const sgstAmount = (subTotal * sgst) / 100;
  const igstAmount = (subTotal * igst) / 100;
  const grandTotal = subTotal + cgstAmount + sgstAmount + igstAmount;

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("⚠ Please select a customer.");
      return;
    }

    if (items.length === 0 || items.some((item) => item.itemName.trim() === "")) {
      alert("⚠ Please add at least one valid item.");
      return;
    }

    try {
      const invoiceData = {
        invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceDate: new Date().toISOString().split("T")[0],
        customerId: selectedCustomer?.customerID,
        reference: reference || "",
        items: items.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          unit: item.unit,
          hsn: item.hsn,
          rate: item.rate,
          discount: item.discount,
          discountedRate: item.discountedRate,
          total: item.total,
        })),
        total: Math.round(subTotal + cgstAmount + sgstAmount + igstAmount),
      };

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
      if(error instanceof Error){
        alert(error.message);
      }
     
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
    <>
    <Container sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center"}} gutterBottom>
        Create Invoice
      </Typography>

      <Autocomplete
        options={customers}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        value={selectedCustomer}
        onChange={handleCustomerChange}
        renderInput={(params) => <TextField {...params} label="Select Customer" variant="outlined" fullWidth margin="normal" />}
      />

      <Table sx={{ mt: 2, border: "1px solid #ddd" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Sr No.</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Unit</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>HSN</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Rate</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Discount (%)</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Discounted Rate</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} sx={{ "& td": { padding: "10px" } }}>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "12px" }}>{index + 1}</TableCell>
              <TableCell><TextField value={item.itemName} onChange={(e) => handleItemChange(index, "itemName", e.target.value)} fullWidth /></TableCell>
              <TableCell><TextField type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))} fullWidth /></TableCell>
              <TableCell><TextField value={item.unit} onChange={(e) => handleItemChange(index, "unit", e.target.value)} fullWidth /></TableCell>
              <TableCell><TextField value={item.hsn} onChange={(e) => handleItemChange(index, "hsn", e.target.value)} fullWidth /></TableCell>
              <TableCell><TextField type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", Number(e.target.value))} fullWidth /></TableCell>
              <TableCell><TextField type="number" value={item.discount} onChange={(e) => handleItemChange(index, "discount", Number(e.target.value))} fullWidth /></TableCell>
              <TableCell>{item.discountedRate.toFixed(2)}</TableCell>
              <TableCell>{item.total.toFixed(2)}</TableCell>
              <TableCell><IconButton color="secondary" onClick={() => removeItem(index)}><Delete /></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={addItem}>Add Item</Button>
      {/* GST and Total Section */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
      {/* Left Side - Invoice Summary */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Invoice Summary
        </Typography>

        <Table sx={{ mt: 2, border: "1px solid #ddd", maxWidth: 400 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Subtotal:</TableCell>
              <TableCell>₹{subTotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CGST ({cgst}%):</TableCell>
              <TableCell>₹{cgstAmount.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SGST ({sgst}%):</TableCell>
              <TableCell>₹{sgstAmount.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IGST ({igst}%):</TableCell>
              <TableCell>₹{igstAmount.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Grand Total:
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                ₹{grandTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      {/* Right Side - Terms & Conditions */}
      <Grid item xs={6} md={6}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Terms & Conditions
        </Typography>
        <TextField
          label="Enter Terms & Conditions"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Grid>
    </Grid>

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <Button variant="contained" color="info" onClick={handlePreviewOpen}>Preview Invoice</Button>
      <Button variant="contained" color="success" onClick={handleSubmit}>Save Invoice</Button>
      <Button variant="contained" color="secondary" onClick={handleGeneratePDF}>Generate Invoice PDF</Button>
      </Stack>
    </Container>
    {/* Invoice Preview Dialog */}
<Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
  <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#f5f5f5" }}>
    Invoice Preview
  </DialogTitle>
  <DialogContent>
    <Container sx={{ border: "2px solid #ddd", padding: 3, borderRadius: 2, backgroundColor: "#fff" }}>
      {/* Invoice Header */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Invoice</Typography>
          <Typography>Date: {new Date().toLocaleDateString()}</Typography>
          <Typography>Invoice No: {invoiceId || "DRAFT"}</Typography>
        </Grid>
        <Grid item>
          <Typography sx={{ fontWeight: "bold" }}>KD Electricals</Typography>
          <Typography>123, Electrical Street</Typography>
          <Typography>Mumbai, India</Typography>
          <Typography>+91 98765 43210</Typography>
        </Grid>
      </Grid>

      {/* Customer Details */}
      <Typography variant="h6" sx={{ fontWeight: "bold", borderBottom: "2px solid #ddd", mb: 2 }}>Bill To:</Typography>
      {selectedCustomer ? (
        <Grid>
          <Typography sx={{ fontWeight: "bold" }}>{selectedCustomer.first_name} {selectedCustomer.first_name}</Typography>
          <Typography>{selectedCustomer.company || "Individual"}</Typography>
          <Typography>{selectedCustomer.address || "N/A"}</Typography>
          <Typography>{selectedCustomer.contact}</Typography>
        </Grid>
      ) : (
        <Typography color="error">⚠ No customer selected</Typography>
      )}

      {/* Items Table */}
      <TableContainer sx={{ mt: 3 }}>
        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>HSN</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rate (₹)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Discount (%)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.itemName || "N/A"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit || "N/A"}</TableCell>
                <TableCell>{item.hsn || "N/A"}</TableCell>
                <TableCell>{item.rate.toFixed(2)}</TableCell>
                <TableCell>{item.discount}%</TableCell>
                <TableCell>{item.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Summary */}
      <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Table sx={{ border: "1px solid #ddd", width: "100%" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Subtotal:</TableCell>
                <TableCell>₹{subTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CGST ({cgst}%):</TableCell>
                <TableCell>₹{cgstAmount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>SGST ({sgst}%):</TableCell>
                <TableCell>₹{sgstAmount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>IGST ({igst}%):</TableCell>
                <TableCell>₹{igstAmount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Grand Total:</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>₹{grandTotal.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      {/* Terms & Conditions */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, borderBottom: "2px solid #ddd" }}>Terms & Conditions</Typography>
      <Typography sx={{ mt: 1 }}>{terms || "No additional terms specified."}</Typography>
    </Container>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenPreview(false)} color="error" variant="contained">Close</Button>
  </DialogActions>
</Dialog>

</>  
  );
}
