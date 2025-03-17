import type { NextApiRequest, NextApiResponse } from "next";
import Customer from "../../../../database/models/Customer";
import Quotation from "../../../../database/models/Quotation";
import Recording from "../../../../database/models/Recording";
import Users from "../../../../database/models/User";
import { Op } from "sequelize";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.limit as string) || 10;
      const searchQuery = req.query.search as string || "";
  
      const { count, rows: customers } = await Customer.findAndCountAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.like]: `%${searchQuery}%` } },
            { last_name: { [Op.like]: `%${searchQuery}%` } },
            { email: { [Op.like]: `%${searchQuery}%` } },
            { contact: { [Op.like]: `%${searchQuery}%` } },
            { address: { [Op.like]: `%${searchQuery}%` } },
            { company_name: { [Op.like]: `%${searchQuery}%` } },
            { requirement: { [Op.like]: `%${searchQuery}%` } },
            { remark: { [Op.like]: `%${searchQuery}%` } },
            { follow_up_date: { [Op.like]: `%${searchQuery}%` } }, 
            { status: { [Op.like]: `%${searchQuery}%` } },        ],
        },
        order: [["customerID", "DESC"]],
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        include: [
          { model: Quotation, as: "quotations" },
          { model: Recording, as: "recordings" },
          { model: Users, as: "users", attributes: ["FirstName"] }, // Fetch only 'FirstName'
        ],
      });
  
  
  
      return res.status(200).json({
        customers: customers,
        totalCustomers: count,
        totalPages: Math.ceil(count / pageSize),
      });
  
    } catch (error) {
      console.error("Error fetching customers:", error);
      return res.status(500).json({ message: "Error fetching customers", error });
    }
  } 

  else if (req.method === "POST") {
    try {
      const { first_name, last_name, email, contact, address, requirement, quotations, recordings, company_name, remark, follow_up_date, user_id } = req.body;

      if (!first_name || !contact) {
        return res.status(400).json({ error: "First Name and Contact are required!" });
      }

      const newCustomer:any = await Customer.create({
        first_name,
        last_name,
        email,
        contact,
        address,
        status: "NotCompleted",
        company_name,
        remark,
        follow_up_date,
        user_id, 
        requirement
      });

      // Create associated quotations if provided
      if (quotations && Array.isArray(quotations)) {
        await Promise.all(
          quotations.map(async (quotationDetails) => {
            await Quotation.create({
              CustomerID: newCustomer?.customerID,
              QuotationDetails: quotationDetails,
            });
          })
        );
      }

      // Create associated recordings if provided
      if (recordings && Array.isArray(recordings)) {
        await Promise.all(
          recordings.map(async (recordingURL) => {
            await Recording.create({
              CustomerID: newCustomer.customerID,
              RecordingURL: recordingURL,
            });
          })
        );
      }

      res.status(201).json(newCustomer);
    } catch (error) {
      console.error("Error saving customer:", error);
      res.status(500).json({ error: "Failed to save customer" });
    }
  } 

  else if (req.method === "PATCH") {
    try {
      const { customerID, quotations, recordings, ...updateFields } = req.body;
     

      if (!customerID) {
        return res.status(400).json({ error: "Customer ID is required for updates." });
      }

      const customer = await Customer.findByPk(customerID);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }

      // Update customer fields
      await customer.update(updateFields);

      // Update or add quotations if provided
      if (quotations && Array.isArray(quotations)) {
        await Promise.all(
          quotations.map(async (quotationDetails) => {
            await Quotation.create({
              CustomerID: customerID,
              QuotationDetails: quotationDetails,
            });
          })
        );
      }

      // Update or add recordings if provided
      if (recordings && Array.isArray(recordings)) {
        await Promise.all(
          recordings.map(async (recordingURL) => {
            await Recording.create({
              CustomerID: customerID,
              RecordingURL: recordingURL,
            });
          })
        );
      }

      res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
