import { NextApiRequest, NextApiResponse } from "next";
import ToDoList from "../../../../database/models/ToDoList";
import Task from "../../../../database/models/Task";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user_id } = req.query;
  try {
    const toDoLists = await ToDoList.findAll({
      where: { user_id },
      include: [{ model: Task }],
      order: [['date', 'ASC']], // Sort by date
    });
    

    return res.status(200).json({ toDoLists });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching To-Do Lists", error });
  }
}
