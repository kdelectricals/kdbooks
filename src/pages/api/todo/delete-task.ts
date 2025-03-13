import { NextApiRequest, NextApiResponse } from "next";
import Task from "../../../../database/models/Task";

import ToDoList from "../../../../database/models/ToDoList";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { taskId } = req.body;

  try {
    const tasks =  await Task.findOne({ where: { id: taskId }, raw : true });
    await ToDoList.destroy({ where: { id: tasks?.to_do_list_id } });
    await Task.destroy({ where: { id: taskId } });
    

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting task", error });
  }
}
