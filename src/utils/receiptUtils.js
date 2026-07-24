// src/utils/receiptUtils.js

/**
 * Generate a unique receipt number.
 * Example: FF-20260720-00001
 */
export const generateReceiptNumber = (orderId) => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `FF-${year}${month}${day}-${String(orderId).padStart(5, "0")}`;
};

/**
 * Format currency in Kenyan Shillings.
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);

/**
 * Format date.
 */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-KE", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Format time.
 */
export const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Format full date and time.
 */
export const formatDateTime = (date) =>
  `${formatDate(date)} ${formatTime(date)}`;

/**
 * Convert payment status into a user-friendly label.
 */
export const formatPaymentStatus = (status) => {
  if (!status) return "Pending";

  switch (status.toLowerCase()) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "partial":
      return "Partially Paid";
    default:
      return status;
  }
};

/**
 * Calculate subtotal.
 */
export const calculateSubtotal = (items = []) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

/**
 * Calculate tax.
 * VAT is set to 0% for now.
 * Change later if needed.
 */
export const calculateTax = (subtotal, rate = 0) =>
  subtotal * rate;

/**
 * Calculate grand total.
 */
export const calculateGrandTotal = (
  subtotal,
  tax = 0,
  discount = 0
) => subtotal + tax - discount;