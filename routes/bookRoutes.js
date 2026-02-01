const express = require("express");
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getLowStockBooks,
} = require("../controllers/bookController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");
const Book = require("../models/Book");

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin routes
// router.post("/", protect, isAdmin, createBook);

router.post("/", protect, isAdmin, upload.array("images", 5), createBook);
router.put("/:id", protect, isAdmin,  upload.array("images", 5), updateBook);
router.delete("/:id", protect, isAdmin, deleteBook);

// ADMIN LOW STOCK ROUTE
router.get("/low-stock", protect, isAdmin, getLowStockBooks);

module.exports = router;
