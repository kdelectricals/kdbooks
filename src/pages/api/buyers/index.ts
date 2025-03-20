import { NextApiRequest, NextApiResponse } from "next";
import Buyer from "../../../../database/models/Buyer";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { first_name, last_name, email, mobile_number, address, created_by } = req.body;
      const newBuyer = await Buyer.create({ first_name, last_name, email, mobile_number, address, created_by });
      return res.status(201).json({ success: true, data: newBuyer });

    } else if (req.method === "GET") {
      const buyers = await Buyer.findAll({ where: { is_deleted: false } });
      console.log(buyers, 'checking api');
      return res.status(200).json({ success: true, data: buyers });

    } else if (req.method === "PUT") {
      const { id } = req.query; // Fix: Extract ID from query
      const { first_name, last_name, email, mobile_number, address, updated_by } = req.body;
      const buyer = await Buyer.findByPk(id);
      if (!buyer) return res.status(404).json({ success: false, message: "Buyer not found" });

      await buyer.update({ first_name, last_name, email, mobile_number, address, updated_by });
      return res.status(200).json({ success: true, data: buyer });

    } else if (req.method === "DELETE") {
      const { id, updated_by } = req.body;
      const buyer = await Buyer.findByPk(id);
      if (!buyer) return res.status(404).json({ success: false, message: "Buyer not found" });

      await buyer.update({ is_deleted: true, updated_by });
      return res.status(200).json({ success: true, message: "Buyer deleted successfully" });

    } else {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
