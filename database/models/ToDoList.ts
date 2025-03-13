import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config";
import Task from "./Task";

interface ToDoListAttributes {
  id: number;
  user_id: number;
  date: string;
}

interface ToDoListCreationAttributes extends Optional<ToDoListAttributes, "id"> {}

class ToDoList extends Model<ToDoListAttributes, ToDoListCreationAttributes> implements ToDoListAttributes {
  public id!: number;
  public user_id!: number;
  public date!: string;
  tasks: any;
}

ToDoList.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, modelName: "to_do_lists", timestamps: false, }
);

// Association with Task model
ToDoList.hasMany(Task, { foreignKey: "to_do_list_id", onDelete: "CASCADE" });
Task.belongsTo(ToDoList, { foreignKey: "to_do_list_id" });

export default ToDoList;
