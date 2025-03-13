import { NextApiRequest, NextApiResponse } from "next";
import Task from "../../../../database/models/Task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { taskId, completed } = req.body;

  try {
    await Task.update({ completed }, { where: { id: taskId } });
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating task", error });
  }
}
