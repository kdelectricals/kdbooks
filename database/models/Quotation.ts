import { DataTypes } from "sequelize";
import sequelize from "../config";


const Quotation = sequelize.define("Quotation", {
  quotationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false} ,
  quotation_path: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  
},
{timestamps: false,});

export default Quotation;
