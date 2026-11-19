
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.id,
        t.type,
        t.amount,
        t.description,
        t.transaction_date,
        c.name AS category
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.transaction_date DESC, t.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Add a transaction
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      category_id,
      type,
      amount,
      description,
      transaction_date
    } = req.body;

    if (
      !user_id ||
      !["income", "expense"].includes(type) ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0 ||
      !transaction_date
    ) {
      return res.status(400).json({
        message: "Valid user, type, amount and date are required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO transactions
       (user_id, category_id, type, amount, description, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        category_id || null,
        type,
        amount,
        description || null,
        transaction_date
      ]
    );

    res.status(201).json({
      message: "Transaction added successfully",
      id: result.insertId
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to add transaction" });
  }
});

module.exports = router;
