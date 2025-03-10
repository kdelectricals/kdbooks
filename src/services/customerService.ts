"use client";  // ✅ Ensure this runs on the client

const API_URL = "/api/customers"; 

export const fetchCustomers = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const addCustomer = async (customerData: any) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    if (!res.ok) throw new Error("Failed to add customer");
    
    return res.json();
  } catch (error) {
    console.error("Add error:", error);
    throw error;
  }
};

