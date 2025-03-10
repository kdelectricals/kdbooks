import { DataTypes } from "sequelize";
import sequelize from "../config";
import Item from "./Item";

const Invoice = sequelize.define("Invoice", {
  InvoiceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  InvoiceNo: { type: DataTypes.STRING, allowNull: false },
  Reference: { type: DataTypes.STRING },
  InvoiceDate: { type: DataTypes.DATEONLY, allowNull: false },
  CustomerID: { type: DataTypes.INTEGER, allowNull: false },
});

Invoice.hasMany(Item, { foreignKey: "InvoiceID", onDelete: "CASCADE" });
Item.belongsTo(Invoice, { foreignKey: "InvoiceID" });

export default Invoice;
