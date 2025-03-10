import { DataTypes } from "sequelize";
import sequelize from "../config";
import Invoice from "./Invoice";

const Item = sequelize.define("Item", {
  ItemID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ItemName: { type: DataTypes.STRING, allowNull: false },
  Quantity: { type: DataTypes.INTEGER, allowNull: false },
  Unit: { type: DataTypes.STRING },
  Discount: { type: DataTypes.FLOAT },
  HSN: { type: DataTypes.STRING },
  Rate: { type: DataTypes.FLOAT, allowNull: false },
  DiscountedRate: { type: DataTypes.FLOAT },
  Total: { type: DataTypes.FLOAT, allowNull: false },
  InvoiceID: { type: DataTypes.INTEGER, references: { model: "Invoices", key: "InvoiceID" } },
});

export default Item;
