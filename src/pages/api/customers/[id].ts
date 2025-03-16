import type { NextApiRequest, NextApiResponse } from "next";
import  Customer  from "../../../.././database/models/Customer"; // Import your Sequelize model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract customer ID from the URL

  if (req.method === "PATCH") {
    try {
      const { first_name, last_name, email, contact, address, company_name, requirement, remark, follow_up_date, status } = req.body;

      // Find customer by ID
      const customer = await Customer.findByPk(id as string);
      if (!customer) return res.status(404).json({ error: "Customer not found" });

      // Update customer details
      await customer.update({ first_name, last_name, email, contact, address, company_name, requirement, remark, follow_up_date, status });

      res.status(200).json({ message: "Customer updated successfully", customer });
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
