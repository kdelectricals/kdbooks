import type { NextApiRequest, NextApiResponse } from "next";
import Invoice from "../../../../database/models/Invoice";
import Item from "../../../../database/models/Item"; // Ensure correct model
import sequelize from "../../../../database/config";
import syncDatabase from "../../../../database/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await syncDatabase();
    await sequelize.authenticate();

    const { id } = req.query;

    if (req.method === "GET") {
      // Fetch invoice with all associated items
      const invoice = await Invoice.findByPk(id, {
        include: [{ model: Item }],
      });

      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      return res.status(200).json(invoice);
    } 
    
    else {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
