import { DataTypes, Model } from "sequelize";
import sequelize from "../config";

class Users extends Model {
  email: string | null | undefined;
  role: unknown;
  id: string;
}

Users.init(
  {
    UserID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "Users", timestamps: false,} // If you don't have createdAt/updatedAt columns 
);

export default Users;
