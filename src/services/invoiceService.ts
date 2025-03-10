import Invoice from "../../database/models/Invoice";
import Item from "../../database/models/Item";
import sequelize from "../../database/config";

/**
 * Fetch an invoice with all its items.
 */
export const getInvoiceWithItems = async (invoiceID: number) => {
  try {
    if (!invoiceID) {
      throw new Error("Invoice ID is required");
    }

    const invoice = await Invoice.findOne({
      where: { InvoiceID: invoiceID }, // Ensure correct case
      include: [
        {
          model: Item,
          as: "Items", // Ensure alias matches model association
        },
      ],
    });

    if (!invoice) {
      return { error: "Invoice not found", status: 404 };
    }

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { error: error.message || "Internal Server Error", status: 500 };
  }
};

/**
 * Create a new invoice with its items.
 */
export const createInvoiceWithItems = async (invoiceData: any) => {
  const transaction = await sequelize.transaction();
  try {
    const { InvoiceNo, InvoiceDate, CustomerID, Reference, Items, Total } = invoiceData;

    // Validate required fields
    if (!InvoiceNo || !InvoiceDate || !CustomerID || !Items || Items.length === 0 || !Total) {
      throw new Error("Missing required fields");
    }

    // Create the invoice
    const newInvoice = await Invoice.create(
      {
        InvoiceNo,
        InvoiceDate,
        CustomerID,
        Reference
      },
      { transaction }
    );

    // Create invoice items
    const invoiceItems = Items.map((item: any) => ({
      InvoiceID: newInvoice.InvoiceID,
      ItemName: item.ItemName,
      Quantity: item.Quantity,
      Rate: item.Rate,
      CustomerID: item.CustomerID,
    }));

    await Item.bulkCreate(invoiceItems, { transaction });

    await transaction.commit(); // Commit transaction if successful

    return { success: true, data: newInvoice };
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    console.error("Error creating invoice:", error);
    return { error: error.message || "Internal Server Error", status: 500 };
  }
};
