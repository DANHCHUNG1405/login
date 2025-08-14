import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Lấy danh sách tất cả người dùng
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM chung_user ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// Thêm người dùng mới
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO chung_user (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// Sửa người dùng
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      "UPDATE chung_user SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email",
      [name, email, password, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

// Xóa người dùng
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM chung_user WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
