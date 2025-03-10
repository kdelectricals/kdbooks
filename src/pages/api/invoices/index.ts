import type { NextApiRequest, NextApiResponse } from "next";
import Invoice from "../../../../database/models/Invoice";
import Item from "../../../../database/models/Item";
import sequelize from "../../../../database/config";
import syncDatabase from "../../../../database/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await syncDatabase();
    await sequelize.authenticate();

    if (req.method === "GET") {
      // Fetch all invoices including items
      const invoices = await Invoice.findAll({
        include: [{ model: Item }],
      });

      return res.status(200).json(invoices);
    } 
    
    else if (req.method === "POST") {
      const { invoiceNo, reference, invoiceDate, customerId, items } = req.body;

      console.log("🔹 Received Invoice Data:", JSON.stringify(req.body, null, 2));

      // ✅ Validate required fields
      if (!invoiceNo || !invoiceDate || !customerId) {
        return res.status(400).json({ message: "Missing required fields: invoiceNo, invoiceDate, or customerId" });
      }

      // ✅ Create new Invoice
      const invoice = await Invoice.create({ 
        InvoiceNo: invoiceNo, 
        Reference: reference || "", 
        InvoiceDate: invoiceDate, 
        CustomerID: customerId 
      });

      console.log("✅ Invoice Created:", invoice.toJSON());

      // ✅ Insert items if present
      if (items && items.length > 0) {
        const newItems = items.map((item: any) => ({
          ItemName: item.itemName,
          Quantity: item.quantity,
          Rate: item.rate,
          Total: item.total,
          InvoiceID: invoice.InvoiceID, // Associate with created invoice
        }));

        await Item.bulkCreate(newItems);
        console.log("✅ Items Added:", newItems);
      }

      return res.status(201).json({ message: "Invoice created successfully", invoice });
    } 
    
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
