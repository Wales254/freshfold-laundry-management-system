const express = require("express");
const pool = require("../db");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

// Require a valid login for every order endpoint.
router.use(authenticateToken);


const normalizePaymentStatus = (status) => {
  if (status == null || String(status).trim() === "") {
    return "Unpaid";
  }

  switch (String(status).trim().toLowerCase()) {
    case "pending":
    case "unpaid":
      return "Unpaid";
    case "partial":
    case "partial payment":
    case "partially paid":
      return "Partial";
    case "paid":
      return "Paid";
    default:
      return null;
  }
};

const normalizeItems = (body) => {
  let items = body.items;

  if (!Array.isArray(items)) {
    if (!body.service) {
      throw new Error("Add at least one service.");
    }

    const quantity = Number(body.quantity) || 1;
    const total = Number(body.total) || 0;

    items = [{
      service: body.service,
      quantity,
      unitPrice: total / quantity,
    }];
  }

  if (items.length === 0) {
    throw new Error("An order must contain at least one service.");
  }

  return items.map((item) => {
    const service = String(item.service || "").trim();
    const quantity = Number(item.quantity);
    const unitPrice = Number(
      item.unitPrice ?? item.unit_price ?? item.price
    );

    if (!service) throw new Error("Every service item must have a name.");
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for ${service}.`);
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(`Invalid price for ${service}.`);
    }

    return {
      service,
      quantity,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    };
  });
};

const summarizeItems = (items) => ({
  service: items.map((item) => item.service).join(", "),
  quantity: items.reduce((sum, item) => sum + Number(item.quantity), 0),
  total: Math.round(
    items.reduce((sum, item) => sum + Number(item.lineTotal), 0) * 100
  ) / 100,
});

const insertItems = async (client, orderId, items) => {
  for (const item of items) {
    await client.query(
      `INSERT INTO order_items
        (order_id, service, quantity, unit_price, line_total)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, item.service, item.quantity, item.unitPrice, item.lineTotal]
    );
  }
};

// Fetch service items and every installment for one order.
const getOrderById = async (client, id) => {
  const result = await client.query(
    `SELECT
       o.id,
       o.customer_id AS "customerId",
       o.customer,
       o.phone,
       o.service,
       o.quantity,
       TO_CHAR(o.delivery_date, 'YYYY-MM-DD') AS "deliveryDate",
       o.status,
       o.total,
       CASE
         WHEN LOWER(TRIM(COALESCE(o.payment_status, '')))
           IN ('pending', 'unpaid', '') THEN 'Unpaid'
         WHEN LOWER(TRIM(COALESCE(o.payment_status, '')))
           IN ('partial', 'partial payment', 'partially paid')
           THEN 'Partial'
         WHEN LOWER(TRIM(COALESCE(o.payment_status, ''))) = 'paid'
           THEN 'Paid'
         ELSE o.payment_status
       END AS "paymentStatus",
       o.payment_method AS "paymentMethod",
       o.amount_paid AS "amountPaid",
       o.balance,
       o.change,
       o.payment_date AS "paymentDate",
       o.created_at AS "createdAt",
       COALESCE((
         SELECT json_agg(
           json_build_object(
             'id', oi.id,
             'service', oi.service,
             'quantity', oi.quantity,
             'unitPrice', oi.unit_price,
             'lineTotal', oi.line_total
           ) ORDER BY oi.id
         )
         FROM order_items oi
         WHERE oi.order_id = o.id
       ), '[]'::json) AS items,
       COALESCE((
         SELECT json_agg(
           json_build_object(
             'id', p.id,
             'orderId', p.order_id,
             'amount', p.amount,
             'method', p.method,
             'date', p.payment_date,
             'createdAt', p.created_at,
             'transactionCode', p.transaction_reference
           ) ORDER BY p.payment_date DESC, p.id DESC
         )
         FROM payments p
         WHERE p.order_id = o.id
       ), '[]'::json) AS payments
     FROM orders o
     WHERE o.id = $1`,
    [id]
  );

  if (result.rowCount === 0) return null;

  const order = result.rows[0];

  if (order.items.length === 0 && order.service) {
    const quantity = Number(order.quantity) || 1;
    const total = Number(order.total) || 0;
    order.items = [{
      id: null,
      service: order.service,
      quantity,
      unitPrice: total / quantity,
      lineTotal: total,
    }];
  }

  return order;
};

// Get all orders, including their payment histories.
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.customer_id AS "customerId",
         o.customer,
         o.phone,
         o.service,
         o.quantity,
         TO_CHAR(o.delivery_date, 'YYYY-MM-DD') AS "deliveryDate",
         o.status,
         o.total,
         CASE
           WHEN LOWER(TRIM(COALESCE(o.payment_status, '')))
             IN ('pending', 'unpaid', '') THEN 'Unpaid'
           WHEN LOWER(TRIM(COALESCE(o.payment_status, '')))
             IN ('partial', 'partial payment', 'partially paid')
             THEN 'Partial'
           WHEN LOWER(TRIM(COALESCE(o.payment_status, ''))) = 'paid'
             THEN 'Paid'
           ELSE o.payment_status
         END AS "paymentStatus",
         o.payment_method AS "paymentMethod",
         o.amount_paid AS "amountPaid",
         o.balance,
         o.change,
         o.payment_date AS "paymentDate",
         o.created_at AS "createdAt",
         COALESCE((
           SELECT json_agg(
             json_build_object(
               'id', oi.id,
               'service', oi.service,
               'quantity', oi.quantity,
               'unitPrice', oi.unit_price,
               'lineTotal', oi.line_total
             ) ORDER BY oi.id
           )
           FROM order_items oi
           WHERE oi.order_id = o.id
         ), '[]'::json) AS items,
         COALESCE((
           SELECT json_agg(
             json_build_object(
               'id', p.id,
               'orderId', p.order_id,
               'amount', p.amount,
               'method', p.method,
               'date', p.payment_date,
               'createdAt', p.created_at,
               'transactionCode', p.transaction_reference
             ) ORDER BY p.payment_date DESC, p.id DESC
           )
           FROM payments p
           WHERE p.order_id = o.id
         ), '[]'::json) AS payments
       FROM orders o
       ORDER BY o.created_at DESC`
    );

    const orders = result.rows.map((order) => {
      if (order.items.length === 0 && order.service) {
        const quantity = Number(order.quantity) || 1;
        const total = Number(order.total) || 0;
        order.items = [{
          id: null,
          service: order.service,
          quantity,
          unitPrice: total / quantity,
          lineTotal: total,
        }];
      }
      return order;
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    res.status(500).json({ message: "Failed to retrieve orders." });
  }
});

// Create an order and link it to a customer.
router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.customer || !String(body.customer).trim()) {
    return res.status(400).json({ message: "Customer name is required." });
  }

  const customerName = String(body.customer).trim();
  const customerPhone = body.phone ? String(body.phone).trim() : null;
  const paymentStatus = normalizePaymentStatus(body.paymentStatus);

  if (!paymentStatus) {
    return res.status(400).json({
      message: "Payment status must be Unpaid, Partial, or Paid.",
    });
  }

  let items;
  try {
    items = normalizeItems(body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const summary = summarizeItems(items);
  const amountPaid = Number(body.amountPaid) || 0;
  const balance = Math.max(0, summary.total - amountPaid);

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    let customerId = null;

    if (customerPhone) {
      const existingCustomer = await client.query(
        `SELECT id FROM customers
         WHERE phone = $1 ORDER BY id LIMIT 1 FOR UPDATE`,
        [customerPhone]
      );

      if (existingCustomer.rowCount > 0) {
        customerId = existingCustomer.rows[0].id;
        await client.query(
          "UPDATE customers SET name = $1 WHERE id = $2",
          [customerName, customerId]
        );
      }
    }

    if (customerId === null) {
      const newCustomer = await client.query(
        `INSERT INTO customers (name, phone)
         VALUES ($1, $2) RETURNING id`,
        [customerName, customerPhone]
      );
      customerId = newCustomer.rows[0].id;
    }

    const result = await client.query(
      `INSERT INTO orders (
         customer_id, customer, phone, service, quantity,
         delivery_date, status, total, payment_status, payment_method,
         amount_paid, balance, change, payment_date
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        customerId,
        customerName,
        customerPhone,
        summary.service,
        summary.quantity,
        body.deliveryDate || null,
        body.status || "Received",
        summary.total,
        paymentStatus,
        body.paymentMethod || null,
        amountPaid,
        body.balance == null ? balance : Number(body.balance),
        Number(body.change) || 0,
        body.paymentDate || null,
      ]
    );

    const orderId = result.rows[0].id;
    await insertItems(client, orderId, items);

    const order = await getOrderById(client, orderId);
    await client.query("COMMIT");
    res.status(201).json(order);
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Failed to create order." });
  } finally {
    if (client) client.release();
  }
});

// Update an order.
router.put("/:id", async (req, res) => {
  const body = req.body;

  const paymentStatus = body.paymentStatus == null
    ? null
    : normalizePaymentStatus(body.paymentStatus);

  if (body.paymentStatus != null && !paymentStatus) {
    return res.status(400).json({
      message: "Payment status must be Unpaid, Partial, or Paid.",
    });
  }

  let items = null;
  if (Array.isArray(body.items)) {
    try {
      items = normalizeItems(body);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT id FROM orders WHERE id = $1 FOR UPDATE",
      [req.params.id]
    );

    if (existing.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found." });
    }

    const summary = items ? summarizeItems(items) : null;

    await client.query(
      `UPDATE orders SET
         customer = COALESCE($1, customer),
         phone = COALESCE($2, phone),
         service = COALESCE($3, service),
         quantity = COALESCE($4, quantity),
         delivery_date = COALESCE($5, delivery_date),
         status = COALESCE($6, status),
         total = COALESCE($7, total),
         payment_status = COALESCE($8, payment_status),
         payment_method = COALESCE($9, payment_method),
         amount_paid = COALESCE($10, amount_paid),
         balance = COALESCE($11, balance),
         change = COALESCE($12, change),
         payment_date = COALESCE($13, payment_date)
       WHERE id = $14`,
      [
        body.customer ?? null,
        body.phone ?? null,
        summary?.service ?? body.service ?? null,
        summary?.quantity ?? body.quantity ?? null,
        body.deliveryDate ?? null,
        body.status ?? null,
        summary?.total ?? body.total ?? null,
        paymentStatus,
        body.paymentMethod ?? null,
        body.amountPaid ?? null,
        body.balance ?? null,
        body.change ?? null,
        body.paymentDate ?? null,
        req.params.id,
      ]
    );

    if (items) {
      await client.query("DELETE FROM order_items WHERE order_id = $1", [
        req.params.id,
      ]);
      await insertItems(client, req.params.id, items);
    }

    const order = await getOrderById(client, req.params.id);
    await client.query("COMMIT");
    res.json(order);
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    console.error("Update order error:", error.message);
    res.status(500).json({ message: "Failed to update order." });
  } finally {
    if (client) client.release();
  }
});

// Get all installment payments for one order.
router.get("/:id/payments", async (req, res) => {
  const orderId = Number(req.params.id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order ID." });
  }

  try {
    const order = await pool.query(
      "SELECT id FROM orders WHERE id = $1",
      [orderId]
    );

    if (order.rowCount === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const result = await pool.query(
      `SELECT
         id,
         order_id AS "orderId",
         amount,
         method,
         payment_date AS "date",
         created_at AS "createdAt",
         transaction_reference AS "transactionCode"
       FROM payments
       WHERE order_id = $1
       ORDER BY payment_date DESC NULLS LAST, id DESC`,
      [orderId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get payment history error:", error.message);
    res.status(500).json({ message: "Failed to retrieve payment history." });
  }
});

// Record an installment payment.
router.post("/:id/payments", async (req, res) => {
  const orderId = Number(req.params.id);
  const amount = Number(req.body.amount);
  const method = String(req.body.method || "").trim();
  const reference = req.body.transactionReference
    ? String(req.body.transactionReference).trim()
    : null;
  const suppliedDate = req.body.paymentDate || req.body.date || null;

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order ID." });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Payment amount must be greater than zero.",
    });
  }

  if (!["Cash", "M-Pesa", "Card", "Bank"].includes(method)) {
    return res.status(400).json({
      message: "Choose Cash, M-Pesa, Card, or Bank.",
    });
  }

  if (method !== "Cash" && !reference) {
    return res.status(400).json({
      message: "Transaction reference is required for non-cash payments.",
    });
  }

  if (suppliedDate && Number.isNaN(Date.parse(suppliedDate))) {
    return res.status(400).json({ message: "Invalid payment date." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const orderResult = await client.query(
      `SELECT id, total, amount_paid AS "amountPaid"
       FROM orders WHERE id = $1 FOR UPDATE`,
      [orderId]
    );

    if (orderResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found." });
    }

    const order = orderResult.rows[0];
    const total = Number(order.total) || 0;
    const previouslyPaid = Number(order.amountPaid) || 0;
    const totalPaid = Math.round((previouslyPaid + amount) * 100) / 100;
    const balance = Math.max(Math.round((total - totalPaid) * 100) / 100, 0);
    const change = Math.max(Math.round((totalPaid - total) * 100) / 100, 0);

    const paymentStatus = totalPaid >= total
      ? "Paid"
      : totalPaid > 0
        ? "Partial"
        : "Unpaid";

    const paymentResult = await client.query(
      `INSERT INTO payments
         (order_id, amount, method, payment_date, transaction_reference)
       VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW()), $5)
       RETURNING
         id,
         order_id AS "orderId",
         amount,
         method,
         payment_date AS "date",
         created_at AS "createdAt",
         transaction_reference AS "transactionCode"`,
      [orderId, amount, method, suppliedDate, reference]
    );

    await client.query(
      `UPDATE orders
       SET amount_paid = $1,
           balance = $2,
           change = $3,
           payment_status = $4,
           payment_method = $5,
           payment_date = $6
       WHERE id = $7`,
      [
        totalPaid,
        balance,
        change,
        paymentStatus,
        method,
        paymentResult.rows[0].date,
        orderId,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Payment saved successfully.",
      payment: paymentResult.rows[0],
      summary: {
        total,
        amountPaid: totalPaid,
        balance,
        change,
        paymentStatus,
      },
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    console.error("Save payment error:", error.message);
    res.status(500).json({ message: "Failed to save payment." });
  } finally {
    if (client) client.release();
  }
});

// Delete an order.
router.delete("/:id", async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    // Delete payments and service items first so foreign keys don't block deletion.
    await client.query("DELETE FROM payments WHERE order_id = $1", [
      req.params.id,
    ]);
    await client.query("DELETE FROM order_items WHERE order_id = $1", [
      req.params.id,
    ]);

    const result = await client.query(
      "DELETE FROM orders WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found." });
    }

    await client.query("COMMIT");
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    console.error("Delete order error:", error.message);
    res.status(500).json({ message: "Failed to delete order." });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
