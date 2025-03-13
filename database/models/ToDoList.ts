import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config";
import User from "./User";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface ToDoListAttributes {
  id: string;
  userId: string;
  date: string;
  tasks: Task[];
}

interface ToDoListCreationAttributes extends Optional<ToDoListAttributes, "id"> {}

class ToDoList extends Model<ToDoListAttributes, ToDoListCreationAttributes> implements ToDoListAttributes {
  public id!: string;
  public userId!: string;
  public date!: string;
  public tasks!: Task[];
}

ToDoList.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ToDoList",
  }
);

// Establish relationship
ToDoList.belongsTo(User, { foreignKey: "userId" });

export default ToDoList;
