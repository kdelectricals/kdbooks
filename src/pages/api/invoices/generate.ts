import { NextApiRequest, NextApiResponse } from "next";
import Invoice from "../../../../database/models/Invoice";
import PDFDocument from "pdfkit";
import fs from "fs";
/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { invoiceId } = req.body;
      const invoice:any = await Invoice.findByPk(invoiceId, { include: ["items"] });
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });

      const pdfPath = `./public/invoices/invoice-${invoiceId}.pdf`;
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(20).text(`Invoice No: ${invoice.invoiceNo}`, { align: "center" });
      doc.fontSize(14).text(`Date: ${invoice.invoiceDate}`);
      doc.end();

      res.status(200).json({ pdfPath: `/invoices/invoice-${invoiceId}.pdf` });
    } catch (error) {
      console.error("Error generating invoice PDF:", error); // Log the error
      res.status(500).json({ error: "Failed to generate invoice PDF" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}