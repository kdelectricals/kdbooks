import { DataTypes } from "sequelize";
import sequelize from "../config";
import Customer from "./Customer";

const Recording = sequelize.define("Recording", {
  recordingID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  CustomerID: { type: DataTypes.INTEGER, allowNull: false },
  RecordingURL: { type: DataTypes.STRING(255), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},{timestamps: false,});

export default Recording;
