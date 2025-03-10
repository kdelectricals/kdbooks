import Invoice from "../models/Invoice";
import Item from "../models/Item";

// Define relationships
Invoice.hasMany(Item, { foreignKey: "invoiceID", onDelete: "CASCADE" });
Item.belongsTo(Invoice, { foreignKey: "invoiceID" });

export { Invoice, Item };
