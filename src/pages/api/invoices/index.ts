import type { NextApiRequest, NextApiResponse } from "next";
import Invoice from "../../../../database/models/Invoice";
import Item from "../../../../database/models/Item";
import sequelize from "../../../../database/config";
import syncDatabase from "../../../../database/index";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await syncDatabase();
    await sequelize.authenticate();

    if (req.method === "GET") {
      // Fetch all invoices including their items
      const invoices = await Invoice.findAll({
        include: [{ model: Item, as: "Items" }], // Ensure alias matches model associations
      });

      return res.status(200).json(invoices);
    } 
    
    else if (req.method === "POST") {
      const { invoiceNo, reference, invoiceDate, customerId, items, total } = req.body;

      console.log("🔹 Received Invoice Data:", JSON.stringify(req.body, null, 2));

      // ✅ Validate required fields
      if (!invoiceNo || !invoiceDate || !customerId || !items || items.length === 0 || !total) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const transaction = await sequelize.transaction();
      try {
        // ✅ Create new Invoice
        const invoice:any = await Invoice.create(
          { 
            InvoiceNo: invoiceNo, 
            Reference: reference || "", 
            InvoiceDate: invoiceDate, 
            CustomerID: customerId, 
            Total: total, // Ensure total is stored
          },
          { transaction }
        );

        console.log("✅ Invoice Created:", invoice.toJSON());

        // ✅ Insert items with all relevant fields
        const newItems = items.map((item: any) => ({
          InvoiceID: invoice.InvoiceID, 
          ItemName: item.itemName,
          Quantity: item.quantity,
          Unit: item.unit, 
          HSN: item.hsn,
          Rate: item.rate,
          Discount: item.discount,
          DiscountedRate: item.discountedRate,
          Total: item.total, // Ensure item total is stored
        }));

        await Item.bulkCreate(newItems, { transaction });
        console.log("✅ Items Added:", newItems);

        await transaction.commit(); // Commit the transaction
        return res.status(201).json({ message: "Invoice created successfully", invoice, items: newItems });

      } catch (error) {
        await transaction.rollback(); // Rollback on failure
        console.error("❌ Error Creating Invoice:", error);
        const err = error as Error;
        return res.status(500).json({ error: "Failed to create invoice", details: err.message });
      }
    } 
    
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    const err = error as Error;
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
