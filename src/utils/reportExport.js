import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/*
==================================
EXPORT PDF
==================================
*/

export const exportPDF = (orders) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("FreshFold Laundry Management System", 14, 20);

  doc.setFontSize(13);
  doc.text("Revenue Report", 14, 30);

  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    38
  );

  const tableData = orders.map((order) => [
    order.id,
    order.customer,
    order.service,
    order.quantity,
    order.status,
    `KES ${order.total}`,
  ]);

  autoTable(doc, {
    head: [[
      "Order ID",
      "Customer",
      "Service",
      "Qty",
      "Status",
      "Amount",
    ]],
    body: tableData,
    startY: 45,
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  doc.setFontSize(12);

  doc.text(
    `Total Orders: ${orders.length}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.text(
    `Total Revenue: KES ${totalRevenue}`,
    14,
    doc.lastAutoTable.finalY + 25
  );

  doc.save("Laundry_Report.pdf");
};

/*
==================================
EXPORT EXCEL
==================================
*/

export const exportExcel = (orders) => {
  const worksheet = XLSX.utils.json_to_sheet(orders);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Laundry Report"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(data, "Laundry_Report.xlsx");
};

/*
==================================
PRINT REPORT
==================================
*/

export const printReport = () => {
  window.print();
};