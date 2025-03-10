import type { NextApiRequest, NextApiResponse } from "next";
import syncDatabase from "../../../database/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await syncDatabase();
  res.status(200).json({ message: "Database synced successfully!" });
}
