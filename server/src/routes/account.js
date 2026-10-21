
const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

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

function publicAccount(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    role: String(user.role).toLowerCase(),
  };
}

// GET /api/account
// Return the currently authenticated user's own account.
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, username, email, phone, role
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Your account could not be found.",
      });
    }

    return res.json({
      account: publicAccount(result.rows[0]),
    });
  } catch (error) {
    console.error("Account loading failed:", error.message);

    return res.status(500).json({
      message: "Unable to load your account details.",
    });
  }
});

// PUT /api/account
// Update only the currently authenticated user's own account.
router.put("/", async (req, res) => {
  const { name, username, email, phone = "" } = req.body;

  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !validUsername(username) ||
    !validEmail(email) ||
    typeof phone !== "string"
  ) {
    return res.status(400).json({
      message:
        "Provide a name, valid username, valid email, and valid phone number.",
    });
  }

  const changingPassword =
    currentPassword !== undefined ||
    newPassword !== undefined;

  if (changingPassword) {
    if (
      typeof currentPassword !== "string" ||
      !currentPassword ||
      !isStrongPassword(newPassword)
    ) {
      return res.status(400).json({
        message:
          "To change your password, enter your current password and a new password of at least 12 characters with uppercase, lowercase, a number, and a symbol.",
      });
    }
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const existing = await client.query(
      `SELECT id, name, username, email, phone, role, password_hash
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [req.user.id]
    );

    if (!existing.rows.length) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Your account could not be found.",
      });
    }

    const user = existing.rows[0];

    if (changingPassword) {
      const matches = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

      if (!matches) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          message: "Your current password is incorrect.",
        });
      }

      if (currentPassword === newPassword) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          message: "Your new password must differ from your current password.",
        });
      }
    }

    let result;

    if (changingPassword) {
      const passwordHash = await bcrypt.hash(newPassword, 12);

      result = await client.query(
        `UPDATE users
         SET name = $1,
             username = $2,
             email = $3,
             phone = $4,
             password_hash = $5,
             updated_at = NOW()
         WHERE id = $6
         RETURNING id, name, username, email, phone, role`,
        [
          name.trim(),
          username.trim(),
          email.trim().toLowerCase(),
          phone.trim() || null,
          passwordHash,
          req.user.id,
        ]
      );
    } else {
      result = await client.query(
        `UPDATE users
         SET name = $1,
             username = $2,
             email = $3,
             phone = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING id, name, username, email, phone, role`,
        [
          name.trim(),
          username.trim(),
          email.trim().toLowerCase(),
          phone.trim() || null,
          req.user.id,
        ]
      );
    }

    await client.query(
      `INSERT INTO audit_logs
         (user_id, username, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, 'user', $1, $4::jsonb)`,
      [
        user.id,
        result.rows[0].username,
        changingPassword
          ? "ACCOUNT_PROFILE_AND_PASSWORD_UPDATED"
          : "ACCOUNT_PROFILE_UPDATED",
        JSON.stringify({
          profileUpdated: true,
          passwordChanged: changingPassword,
        }),
      ]
    );

    await client.query("COMMIT");

    return res.json({
      message: changingPassword
        ? "Account details and password updated successfully."
        : "Account details updated successfully.",
      account: publicAccount(result.rows[0]),
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "That username or email is already in use.",
      });
    }

    console.error("Account update failed:", error.message);

    return res.status(500).json({
      message: "Unable to update your account.",
    });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
