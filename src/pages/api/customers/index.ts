import type { NextApiRequest, NextApiResponse } from "next";
import Customer from "../../../../database/models/Customer";
import sequelize from "../../../../database/config";
import syncDatabase from "../../../../database/index";

await syncDatabase(); // Ensure the database is synced before handling requests

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      await sequelize.authenticate();
      const customers = await Customer.findAll();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers", details: error });
    }
  } 
  
  else if (req.method === "POST") {
    try {
      const { firstName, lastName, contact, email, company, address } = req.body;

      if (!firstName || !lastName || !contact || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newCustomer = await Customer.create({
        firstName,
        lastName,
        contact,
        email,
        company,
        address,
      });

      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(500).json({ error: "Failed to add customer", details: error });
    }
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
