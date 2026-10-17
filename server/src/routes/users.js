const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

const ALLOWED_ROLES = ["admin", "manager", "cashier", "attendant"];
const ADMIN_CHANGE_LOCK = 837202;

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function validUsername(username) {
  return (
    typeof username === "string" &&
    /^[A-Za-z0-9_.-]{3,50}$/.test(username.trim())
  );
}

function validEmail(email) {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    role: String(user.role).toLowerCase(),
    status: user.is_active ? "Active" : "Suspended",
    created_at: user.created_at,
    last_login: user.last_login,
  };
}

async function writeAudit(
  client,
  actor,
  action,
  entityId,
  details = {}
) {
  await client.query(
    `INSERT INTO audit_logs
      (user_id, username, action, entity_type, entity_id, details)
     VALUES ($1, $2, $3, 'user', $4, $5::jsonb)`,
    [
      actor.id,
      actor.username,
      action,
      entityId,
      JSON.stringify(details),
    ]
  );
}

function handleDatabaseError(error, res, action) {
  if (error.code === "23505") {
    return res.status(409).json({
      message: "That username or email is already in use.",
    });
  }

  if (error.code === "23503") {
    console.error(`${action}: foreign-key constraint failed`);

    return res.status(409).json({
      message:
        "This operation conflicts with related database records. Existing records have been preserved.",
    });
  }

  console.error(`${action}:`, error.message);

  return res.status(500).json({
    message: "The employee operation could not be completed.",
  });
}

// All employee-management endpoints require an administrator.
router.use(authenticateToken, authorizeRoles("admin"));

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, username, email, phone, role,
              is_active, created_at, last_login
       FROM users
       ORDER BY id ASC`
    );

    return res.json({
      users: result.rows.map(publicUser),
    });
  } catch (error) {
    return handleDatabaseError(error, res, "Employee listing failed");
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  const {
    name,
    username,
    email,
    phone = "",
    role = "cashier",
    status = "Active",
    password,
  } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !validUsername(username) ||
    !validEmail(email) ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      message: "Provide a name, valid username, email, and password.",
    });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 12 characters and include uppercase, lowercase, a number, and a special character.",
    });
  }

  const normalizedRole = String(role).toLowerCase();

  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid employee role." });
  }

  if (!["Active", "Suspended"].includes(status)) {
    return res.status(400).json({ message: "Invalid account status." });
  }

  if (phone != null && typeof phone !== "string") {
    return res.status(400).json({ message: "Invalid phone number." });
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await client.query(
      `INSERT INTO users
        (name, username, email, phone, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, username, email, phone, role,
                 is_active, created_at, last_login`,
      [
        name.trim(),
        username.trim(),
        email.trim().toLowerCase(),
        typeof phone === "string" && phone.trim() ? phone.trim() : null,
        passwordHash,
        normalizedRole,
        status === "Active",
      ]
    );

    const user = result.rows[0];

    await writeAudit(client, req.user, "USER_CREATED", user.id, {
      username: user.username,
      role: user.role,
      isActive: user.is_active,
    });

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Employee account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    return handleDatabaseError(error, res, "Employee creation failed");
  } finally {
    if (client) client.release();
  }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, username, email, phone, role, status } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Invalid employee ID." });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !validUsername(username) ||
    !validEmail(email)
  ) {
    return res.status(400).json({
      message: "Provide a name, valid username, and valid email.",
    });
  }

  if (phone != null && typeof phone !== "string") {
    return res.status(400).json({ message: "Invalid phone number." });
  }

  const normalizedRole = String(role || "").toLowerCase();

  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid employee role." });
  }

  if (!["Active", "Suspended"].includes(status)) {
    return res.status(400).json({ message: "Invalid account status." });
  }

  if (id === Number(req.user.id) &&
      (normalizedRole !== "admin" || status !== "Active")) {
    return res.status(400).json({
      message: "You cannot demote or suspend your own administrator account.",
    });
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    // Serialize operations that could remove an active administrator.
    await client.query(
      "SELECT pg_advisory_xact_lock($1)",
      [ADMIN_CHANGE_LOCK]
    );

    const existing = await client.query(
      "SELECT id, role, is_active FROM users WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (!existing.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found." });
    }

    const previous = existing.rows[0];

    if (
      previous.role === "admin" &&
      previous.is_active &&
      (normalizedRole !== "admin" || status !== "Active")
    ) {
      const admins = await client.query(
        `SELECT COUNT(*)::int AS total
         FROM users
         WHERE role = 'admin' AND is_active = TRUE`
      );

      if (admins.rows[0].total <= 1) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message:
            "You cannot deactivate or demote the last active administrator.",
        });
      }
    }

    const result = await client.query(
      `UPDATE users
       SET name = $1, username = $2, email = $3, phone = $4,
           role = $5, is_active = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING id, name, username, email, phone, role,
                 is_active, created_at, last_login`,
      [
        name.trim(),
        username.trim(),
        email.trim().toLowerCase(),
        typeof phone === "string" && phone.trim() ? phone.trim() : null,
        normalizedRole,
        status === "Active",
        id,
      ]
    );

    await writeAudit(client, req.user, "USER_UPDATED", id, {
      role: normalizedRole,
      status,
    });

    await client.query("COMMIT");

    return res.json({
      message: "Employee updated successfully.",
      user: publicUser(result.rows[0]),
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    return handleDatabaseError(error, res, "Employee update failed");
  } finally {
    if (client) client.release();
  }
});

// PATCH /api/users/:id/status
router.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Invalid employee ID." });
  }

  if (!["Active", "Suspended"].includes(status)) {
    return res.status(400).json({ message: "Invalid account status." });
  }

  if (id === Number(req.user.id) && status !== "Active") {
    return res.status(400).json({
      message: "You cannot suspend your own account.",
    });
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      "SELECT pg_advisory_xact_lock($1)",
      [ADMIN_CHANGE_LOCK]
    );

    const result = await client.query(
      "SELECT id, role, is_active FROM users WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found." });
    }

    const target = result.rows[0];
    const activate = status === "Active";

    if (target.role === "admin" && target.is_active && !activate) {
      const admins = await client.query(
        `SELECT COUNT(*)::int AS total
         FROM users
         WHERE role = 'admin' AND is_active = TRUE`
      );

      if (admins.rows[0].total <= 1) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "You cannot suspend the last active administrator.",
        });
      }
    }

    await client.query(
      "UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2",
      [activate, id]
    );

    await writeAudit(client, req.user, "USER_STATUS_CHANGED", id, {
      status,
    });

    await client.query("COMMIT");

    return res.json({
      message: `Employee account ${status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    return handleDatabaseError(error, res, "Status update failed");
  } finally {
    if (client) client.release();
  }
});

// PATCH /api/users/:id/password
router.patch("/:id/password", async (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Invalid employee ID." });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 12 characters and include uppercase, lowercase, a number, and a special character.",
    });
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const target = await client.query(
      "SELECT id, username FROM users WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (!target.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [passwordHash, id]
    );

    await writeAudit(client, req.user, "USER_PASSWORD_RESET", id, {
      username: target.rows[0].username,
    });

    await client.query("COMMIT");

    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    return handleDatabaseError(error, res, "Password reset failed");
  } finally {
    if (client) client.release();
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Invalid employee ID." });
  }

  if (id === Number(req.user.id)) {
    return res.status(400).json({
      message: "You cannot delete your own account.",
    });
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      "SELECT pg_advisory_xact_lock($1)",
      [ADMIN_CHANGE_LOCK]
    );

    const result = await client.query(
      "SELECT id, username, role, is_active FROM users WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found." });
    }

    const target = result.rows[0];

    if (target.role === "admin" && target.is_active) {
      const admins = await client.query(
        `SELECT COUNT(*)::int AS total
         FROM users
         WHERE role = 'admin' AND is_active = TRUE`
      );

      if (admins.rows[0].total <= 1) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "You cannot delete the last active administrator.",
        });
      }
    }

    // Keep a full deletion record in audit_logs before deleting the account.
    await writeAudit(client, req.user, "USER_DELETED", id, {
      deletedUserId: target.id,
      username: target.username,
      role: target.role,
    });

    await client.query("DELETE FROM users WHERE id = $1", [id]);

    await client.query("COMMIT");

    return res.json({ message: "Employee deleted successfully." });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    return handleDatabaseError(error, res, "Employee deletion failed");
  } finally {
    if (client) client.release();
  }
});

module.exports = router;