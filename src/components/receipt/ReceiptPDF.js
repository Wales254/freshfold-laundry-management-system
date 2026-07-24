import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  generateReceiptNumber,
  formatCurrency,
  formatDateTime,
} from "../../utils/receiptUtils";

const generateReceiptPDF = (order) => {
  const doc = new jsPDF();

  const receiptNumber =
    order.receiptNo || generateReceiptNumber(order.id);

  // ===========================
  // BUSINESS HEADER
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(25, 118, 210);

  doc.text("FreshFold Laundry", 105, 18, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);

  doc.text(
    "Professional Laundry & Dry Cleaning Services",
    105,
    26,
    { align: "center" }
  );

  doc.text("Nairobi, Kenya", 105, 32, {
    align: "center",
  });

  doc.text("Tel: +254 700 000 000", 105, 38, {
    align: "center",
  });

  doc.text("Email: info@freshfold.co.ke", 105, 44, {
    align: "center",
  });

  // ===========================
  // RECEIPT INFORMATION
  // ===========================

  let y = 56;

  doc.setFontSize(12);
  doc.setTextColor(0);

  doc.text(`Receipt No: ${receiptNumber}`, 14, y);
  doc.text(`Order No: #${order.id}`, 110, y);

  y += 8;

  doc.text(
    `Date: ${formatDateTime(
      order.paymentDate || new Date()
    )}`,
    14,
    y
  );

  doc.text(
    `Attendant: ${
      order.attendant || "Front Desk"
    }`,
    110,
    y
  );

  // ===========================
  // CUSTOMER INFORMATION
  // ===========================

  y += 14;

  doc.setFont("helvetica", "bold");
  doc.text("Customer Information", 14, y);

  doc.setFont("helvetica", "normal");

  y += 8;

  doc.text(`Customer: ${order.customer}`, 14, y);

  y += 8;

  doc.text(`Phone: ${order.phone}`, 14, y);

  // ===========================
  // ORDER DETAILS
  // ===========================

  const unitPrice =
    order.quantity > 0
      ? order.total / order.quantity
      : order.total;

  autoTable(doc, {
    startY: y + 10,

    head: [
      [
        "Service",
        "Quantity",
        "Unit Price",
        "Total",
      ],
    ],

    body: [
      [
        order.service,
        order.quantity,
        formatCurrency(unitPrice),
        formatCurrency(order.total),
      ],
    ],

    headStyles: {
      fillColor: [25, 118, 210],
      halign: "center",
    },

    bodyStyles: {
      halign: "center",
    },

    styles: {
      fontSize: 10,
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ===========================
  // ORDER STATUS
  // ===========================

  doc.setFont("helvetica", "bold");

  doc.text("Order Status", 14, y);

  doc.setFont("helvetica", "normal");

  y += 8;

  doc.text(`Current Status: ${order.status}`, 14, y);

  y += 8;

  doc.text(
    `Pickup Date: ${order.deliveryDate}`,
    14,
    y
  );

  // ===========================
  // PAYMENT INFORMATION
  // ===========================

  y += 16;

  doc.setFont("helvetica", "bold");

  doc.text("Payment Information", 14, y);

  doc.setFont("helvetica", "normal");

  y += 8;

  doc.text(
    `Total Amount: ${formatCurrency(order.total)}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Amount Paid: ${formatCurrency(
      order.amountPaid ?? 0
    )}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Balance: ${formatCurrency(
      order.balance ?? order.total
    )}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Change: ${formatCurrency(
      order.change ?? 0
    )}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Payment Status: ${
      order.paymentStatus || "Pending"
    }`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Payment Method: ${
      order.paymentMethod || "Cash"
    }`,
    14,
    y
  );

  // ===========================
  // TERMS
  // ===========================

  y += 18;

  doc.setFont("helvetica", "bold");

  doc.text("Terms & Conditions", 14, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  y += 8;

  doc.text(
    "• Present this receipt when collecting garments.",
    18,
    y
  );

  y += 6;

  doc.text(
    "• Customers should inspect garments before leaving.",
    18,
    y
  );

  y += 6;

  doc.text(
    "• Items not collected within 30 days may attract storage charges.",
    18,
    y
  );

  y += 6;

  doc.text(
    "• FreshFold is not liable for damage caused by incorrect care labels.",
    18,
    y
  );

  // ===========================
  // SIGNATURES
  // ===========================

  y += 22;

  doc.line(20, y, 80, y);

  doc.line(130, y, 190, y);

  y += 6;

  doc.text("Customer Signature", 25, y);

  doc.text("Cashier Signature", 135, y);

  // ===========================
  // FOOTER
  // ===========================

  y += 20;

  doc.setFontSize(11);
  doc.setTextColor(90);

  doc.text(
    "Thank you for choosing FreshFold Laundry.",
    105,
    y,
    {
      align: "center",
    }
  );

  y += 6;

  doc.text(
    "Building trust, one clean garment at a time.",
    105,
    y,
    {
      align: "center",
    }
  );

  y += 6;

  doc.text(
    "Please retain this receipt for garment collection.",
    105,
    y,
    {
      align: "center",
    }
  );

  doc.save(`${receiptNumber}.pdf`);
};

export default generateReceiptPDF;