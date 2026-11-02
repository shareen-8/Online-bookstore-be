// 


const Book = require("../models/Book");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// =======================
// CREATE BOOK (Admin)
// =======================
exports.createBook = async (req, res) => {
  try {
    // Upload multiple images to Cloudinary
    const uploadedImages = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            uploadToCloudinary(file.buffer)
          )
        )
      : [];

    // Extract Cloudinary URLs
    const images = uploadedImages.map((image) => image.url);

    const book = await Book.create({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      images: images.length ? images : req.body.images || [],
    });

    res.status(201).json(book);

  } catch (error) {
    console.error("Create Book Error:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};


// =======================
// GET ALL BOOKS (Public)
// =======================
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.json(books);

  } catch (error) {
    console.error("Get All Books Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// GET SINGLE BOOK
// =======================
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);

  } catch (error) {
    console.error("Get Book Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// UPDATE BOOK (Admin)
// =======================
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Existing images selected to keep
    let existingImages = [];

    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        existingImages = req.body.existingImages;
      } else {
        try {
          existingImages = JSON.parse(req.body.existingImages);

          if (!Array.isArray(existingImages)) {
            existingImages = [req.body.existingImages];
          }
        } catch {
          existingImages = [req.body.existingImages];
        }
      }
    }

    // Upload newly selected images
    const uploadedImages = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            uploadToCloudinary(file.buffer)
          )
        )
      : [];

    const newImages = uploadedImages.map((image) => image.url);

    // Update book details
    book.title = req.body.title ?? book.title;
    book.author = req.body.author ?? book.author;
    book.price = req.body.price ?? book.price;
    book.stock = req.body.stock ?? book.stock;
    book.description = req.body.description ?? book.description;

    // Keep selected old images and add new images
    book.images = [
      ...existingImages,
      ...newImages,
    ];

    await book.save();

    res.json(book);

  } catch (error) {
    console.error("Update Book Error:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};


// =======================
// DELETE BOOK (Admin)
// =======================
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
    });

  } catch (error) {
    console.error("Delete Book Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// GET LOW STOCK BOOKS (Admin)
// =======================
exports.getLowStockBooks = async (req, res) => {
  try {
    const lowStockBooks = await Book.find({
      stock: { $lt: 5 },
    });

    res.json(lowStockBooks);

  } catch (error) {
    console.error("Get Low Stock Books Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};



