
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  generateReceiptNumber,
  formatCurrency,
  formatDateTime,
} from "../../utils/receiptUtils";

const formatReceiptDate = (value) => {
  if (!value) return "N/A";

  try {
    return formatDateTime(value);
  } catch {
    return String(value);
  }
};

const generateReceiptPDF = (order, payments = [], staffName = "") => {
  if (!order) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const receiptNumber =
    order.receiptNo || generateReceiptNumber(order.id);

  const allPayments = Array.isArray(payments) ? payments : [];

  const totalPaid = allPayments.length
    ? allPayments.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      )
    : Number(order.amountPaid || 0);

  const orderTotal = Number(order.total || 0);
  const balance = Math.max(
    0,
    Number(order.balance ?? orderTotal - totalPaid)
  );

  const services =
    Array.isArray(order.services) && order.services.length
      ? order.services
      : [order];

  const latestPayment =
    allPayments.length > 0
      ? allPayments[allPayments.length - 1]
      : null;

  // ===========================
  // BUSINESS HEADER
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(25, 118, 210);

  doc.text("FreshFold Laundry", pageWidth / 2, 18, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);

  doc.text(
    "Professional Laundry & Dry Cleaning Services",
    pageWidth / 2,
    26,
    { align: "center" }
  );

  doc.text("Nairobi, Kenya", pageWidth / 2, 32, {
    align: "center",
  });

  doc.text("Tel: +254 700 000 000", pageWidth / 2, 38, {
    align: "center",
  });

  doc.text("Email: info@freshfold.co.ke", pageWidth / 2, 44, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0);

  doc.text("PAYMENT RECEIPT", pageWidth / 2, 52, {
    align: "center",
  });

  // ===========================
  // RECEIPT INFORMATION
  // ===========================

  let y = 62;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Receipt No: ${receiptNumber}`, margin, y);
  doc.text(`Order No: #${order.id}`, pageWidth / 2, y);

  y += 7;

  doc.text(
    `Receipt Date: ${formatReceiptDate(
      latestPayment?.date ||
        latestPayment?.createdAt ||
        new Date()
    )}`,
    margin,
    y
  );

  doc.text(
    `Attended By: ${staffName || "Staff name unavailable"}`,
    pageWidth / 2,
    y
  );

  y += 7;

  doc.text(`Order Status: ${order.status || "N/A"}`, margin, y);
  doc.text(
    `Delivery Date: ${order.deliveryDate || "N/A"}`,
    pageWidth / 2,
    y
  );

  // ===========================
  // CUSTOMER INFORMATION
  // ===========================

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Customer Information", margin, y);

  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `Customer: ${String(order.customer || "N/A")}`,
    margin,
    y
  );

  y += 6;

  doc.text(
    `Phone: ${String(order.phone || "N/A")}`,
    margin,
    y
  );

  // ===========================
  // ORDER DETAILS
  // ===========================

  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Order Details", margin, y);

  autoTable(doc, {
    startY: y + 4,
    margin: { left: margin, right: margin, bottom: 18 },
    head: [["Service", "Quantity", "Unit Price", "Total"]],
    body: services.map((item) => {
      const quantity = Number(item.quantity || 0);
      const itemTotal = Number(item.total || 0);
      const unitPrice =
        quantity > 0 ? itemTotal / quantity : itemTotal;

      return [
        String(item.service || "Service"),
        quantity || "—",
        formatCurrency(unitPrice),
        formatCurrency(itemTotal),
      ];
    }),
    theme: "grid",
    headStyles: {
      fillColor: [25, 118, 210],
      halign: "center",
    },
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
    },
    columnStyles: {
      1: { halign: "center", cellWidth: 22 },
      2: { halign: "right", cellWidth: 36 },
      3: { halign: "right", cellWidth: 36 },
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // Start the next section on a fresh page if little space remains.
  if (y > pageHeight - 65) {
    doc.addPage();
    y = 20;
  }

  // ===========================
  // INSTALLMENT HISTORY
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0);

  doc.text("Payment History - All Installments", margin, y);

  autoTable(doc, {
    startY: y + 4,
    margin: { left: margin, right: margin, bottom: 18 },
    head: [[
      "#",
      "Payment Date",
      "Method",
      "Transaction Code",
      "Amount",
    ]],
    body: allPayments.length
      ? allPayments.map((item, index) => {
          const method = String(item.method || "N/A");
          const isCash = method.toLowerCase() === "cash";

          const code = isCash
            ? "—"
            : item.transactionCode ||
              item.transactionReference ||
              item.transaction_reference ||
              "Not recorded";

          return [
            index + 1,
            formatReceiptDate(item.date || item.createdAt),
            method,
            String(code),
            formatCurrency(Number(item.amount || 0)),
          ];
        })
      : [[
          "—",
          "N/A",
          "N/A",
          "No payment records available",
          formatCurrency(Number(order.amountPaid || 0)),
        ]],
    theme: "grid",
    headStyles: {
      fillColor: [25, 118, 210],
      halign: "center",
    },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 36 },
      2: { cellWidth: 25 },
      3: { cellWidth: "auto" },
      4: { cellWidth: 30, halign: "right" },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ===========================
  // PAYMENT SUMMARY
  // ===========================

  if (y > pageHeight - 55) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Payment Summary", margin, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Total Order Cost: ${formatCurrency(orderTotal)}`, margin, y);

  y += 7;

  doc.setTextColor(0, 128, 0);
  doc.text(`Total Paid: ${formatCurrency(totalPaid)}`, margin, y);

  y += 7;

  doc.setTextColor(balance > 0 ? 200 : 0, balance > 0 ? 0 : 128, 0);
  doc.text(`Outstanding Balance: ${formatCurrency(balance)}`, margin, y);

  y += 7;

  doc.setTextColor(0);
  doc.text(
    `Payment Status: ${
      order.paymentStatus ||
      (balance <= 0 ? "Paid" : totalPaid > 0 ? "Partial" : "Unpaid")
    }`,
    margin,
    y
  );

  // ===========================
  // TERMS AND SIGNATURES
  // ===========================

  y += 12;

  if (y > pageHeight - 55) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Terms & Conditions", margin, y);

  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const terms = [
    "Present this receipt when collecting garments.",
    "Customers should inspect garments before leaving.",
    "Items not collected within 30 days may attract storage charges.",
    "FreshFold is not responsible for damage caused by incorrect care labels.",
  ];

  terms.forEach((term) => {
    const lines = doc.splitTextToSize(term, pageWidth - margin * 2 - 4);

    if (y + lines.length * 4 > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }

    doc.text(`- ${lines[0]}`, margin + 2, y);

    if (lines.length > 1) {
      doc.text(lines.slice(1), margin + 6, y + 4);
      y += (lines.length - 1) * 4;
    }

    y += 5;
  });

  y += 8;

  if (y > pageHeight - 28) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(120);
  doc.line(margin, y, 85, y);
  doc.line(120, y, pageWidth - margin, y);

  y += 5;

  doc.setFontSize(8);
  doc.text("Customer Signature", margin, y);
  doc.text("Attended By", 120, y);

  y += 5;

  doc.text(
    String(staffName || "Staff name unavailable"),
    120,
    y
  );

  // ===========================
  // PAGE FOOTERS
  // ===========================

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);

    doc.text(
      "Thank you for choosing FreshFold Laundry.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: "right" }
    );
  }

  doc.save(`${receiptNumber}.pdf`);
};

export default generateReceiptPDF;
