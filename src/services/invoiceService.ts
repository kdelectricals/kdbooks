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
      where: { InvoiceID: invoiceID },
      include: [
        {
          model: Item,
          as: "Items",
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
 * Create a new invoice with all its details.
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
        Reference,
        Total, // Ensure total is stored in the invoice
      },
      { transaction }
    );

    // Create invoice items with all relevant fields
    const invoiceItems = Items.map((item: any) => ({
      InvoiceID: newInvoice.InvoiceID,
      ItemName: item.ItemName,
      Quantity: item.Quantity,
      Unit: item.Unit,
      HSN: item.HSN,
      Rate: item.Rate,
      Discount: item.Discount,
      DiscountedRate: item.DiscountedRate,
      Total: item.Total, // Ensure total per item is stored
    }));

    await Item.bulkCreate(invoiceItems, { transaction });

    await transaction.commit(); // Commit transaction if successful

    return { success: true, data: { invoice: newInvoice, items: invoiceItems } };
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    console.error("Error creating invoice:", error);
    return { error: error.message || "Internal Server Error", status: 500 };
  }
};
