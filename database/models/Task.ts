import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config";

interface TaskAttributes {
  id: number;
  to_do_list_id: number;
  text: string;
  completed: boolean;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, "id"> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public to_do_list_id!: number;
  public text!: string;
  public completed!: boolean;
}

Task.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    to_do_list_id: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "tasks", timestamps: false, }
);

export default Task;
