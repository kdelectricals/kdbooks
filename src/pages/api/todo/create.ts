import { NextApiRequest, NextApiResponse } from "next";
import ToDoList from "../../../../database/models/ToDoList";
import Task from "../../../../database/models/Task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { user_id, date, tasks } = req.body;

  try {
    const toDoList = await ToDoList.create({ user_id, date });
    if (tasks && tasks.length > 0) {
      await Task.bulkCreate(tasks.map((task: { text: string }) => ({
        to_do_list_id: toDoList.id,
        text: task.text,
        completed: false,
      })));
    }

    return res.status(201).json({ message: "To-Do List created successfully", toDoList });
  } catch (error) {
    return res.status(500).json({ message: "Error creating To-Do List", error });
  }
}
