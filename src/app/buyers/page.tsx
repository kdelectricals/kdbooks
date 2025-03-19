"use client";
import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import { Edit, Save, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Buyers {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  address: string;
  status: 'active' | 'inactive';
}

const CustomerTable: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyers[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [newBuyer, setNewBuyer] = useState<Omit<Buyers, 'id'>>({
    first_name: '', last_name: '', email: '', mobile_number: '', address: '', status: 'active'
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; data: Buyers[] }>('/api/buyers');
      if (data.success) setBuyers(data.data);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const handleEdit = (id: number, field: string) => {
    setEditingId(id);
    setEditingField(field);
  };

  const handleBlur = async (id: number, field: keyof Buyers, value: string) => {
    try {
      setBuyers(prev => prev.map(buyer => buyer.id === id ? { ...buyer, [field]: value } : buyer));
      await axios.put(`/api/buyers/${id}`, { [field]: value });
    } catch (error) {
      console.error("Error updating buyer:", error);
    } finally {
      setEditingId(null);
      setEditingField(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/buyers`, { data: { id } });
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting buyer:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('/api/buyers', newBuyer);
      setNewBuyer({ first_name: '', last_name: '', mobile_number: '', address: '', email: '', status: 'active' });
      fetchCustomers();
    } catch (error) {
      console.error("Error adding buyer:", error);
    }
  };

  const filteredCustomers = buyers.filter(buyer =>
    buyer.first_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <TextField label="Search" variant="outlined" fullWidth margin="normal" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {['first_name', 'last_name', 'email', 'mobile_number', 'address'].map(field => (
              <TableCell key={field}>
                <TextField
                  value={newBuyer[field as keyof typeof newBuyer]}
                  onChange={(e) => setNewBuyer({ ...newBuyer, [field]: e.target.value })}
                  placeholder={field.replace('_', ' ')}
                />
              </TableCell>
            ))}
            <TableCell><IconButton onClick={handleAdd}><Add /></IconButton></TableCell>
          </TableRow>
          {filteredCustomers.map((buyer) => (
            <TableRow key={buyer.id}>
              {['first_name', 'last_name', 'email', 'mobile_number', 'address'].map(field => (
                <TableCell key={field} onDoubleClick={() => handleEdit(buyer.id, field)}>
                  {editingId === buyer.id && editingField === field ? (
                    <TextField
                      defaultValue={buyer[field as keyof Buyers]}
                      onBlur={(e) => handleBlur(buyer.id, field as keyof Buyers, e.target.value)}
                      autoFocus
                      inputRef={inputRef}
                    />
                  ) : (
                    buyer[field as keyof Buyers]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={() => handleDelete(buyer.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerTable;
