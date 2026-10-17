
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const PASSWORD_MIN_LENGTH = 12;

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= PASSWORD_MIN_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

// POST /api/auth/bootstrap
// Creates the first Admin only when the database has no users.
router.post("/bootstrap", async (req, res) => {
  const configuredSecret = process.env.BOOTSTRAP_SECRET;
  const suppliedSecret = req.get("x-bootstrap-secret");

  if (!configuredSecret) {
    return res.status(503).json({
      message: "Admin setup is not enabled.",
    });
  }

  if (
    typeof suppliedSecret !== "string" ||
    suppliedSecret.length !== configuredSecret.length ||
    suppliedSecret !== configuredSecret
  ) {
    return res.status(403).json({
      message: "Invalid setup credentials.",
    });
  }

  const { name, username, email, phone, password } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof username !== "string" ||
    !/^[a-zA-Z0-9_.-]{3,50}$/.test(username.trim()) ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !isStrongPassword(password)
  ) {
    return res.status(400).json({
      message:
        "Provide a name, valid email, username of 3–50 letters/numbers/._-, and a password of at least 12 characters containing uppercase, lowercase, a number, and a symbol.",
    });
  }

  let client;

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured on the server.",
      });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    // Prevent two simultaneous requests from creating first accounts.
    await client.query("SELECT pg_advisory_xact_lock($1)", [837201]);

    const existingUsers = await client.query(
      "SELECT id FROM users LIMIT 1"
    );

    if (existingUsers.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message:
          "Initial setup is closed because an account already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await client.query(
      `INSERT INTO users
        (name, username, email, phone, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'admin', TRUE)
       RETURNING id, name, username, email, phone, role, is_active, created_at`,
      [
        name.trim(),
        username.trim(),
        email.trim().toLowerCase(),
        typeof phone === "string" && phone.trim()
          ? phone.trim()
          : null,
        passwordHash,
      ]
    );

    const user = result.rows[0];

    await client.query(
      `INSERT INTO audit_logs
        (user_id, username, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      [
        user.id,
        user.username,
        "INITIAL_ADMIN_CREATED",
        "user",
        user.id,
        JSON.stringify({ role: "admin" }),
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message:
        "Initial Admin account created. You can now log in.",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.is_active ? "Active" : "Suspended",
        created_at: user.created_at,
      },
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Admin bootstrap failed:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "That username or email may already be registered.",
      });
    }

    return res.status(500).json({
      message: "Unable to create the initial Admin account.",
    });
  } finally {
    if (client) client.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured on the server.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, username, email, password_hash, role, is_active
       FROM users
       WHERE LOWER(username) = LOWER($1)
       LIMIT 1`,
      [username.trim()]
    );

    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1",
      [user.id]
    );

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      message: "Unable to log in at this time.",
    });
  }
});

module.exports = router;
