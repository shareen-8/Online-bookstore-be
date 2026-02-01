const Book = require("../models/Book");



// =======================
// CREATE BOOK (Admin)
// =======================
exports.createBook = async (req, res) => {
  try {
    // const images = req.files
    //   ? req.files.map(file => `/uploads/${file.filename}`)
    //   : [];
   const images =
      req.files?.map(file => `/uploads/${file.filename}`) ||
      req.body.images ||
      [];

      
    const book = await Book.create({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description, // ✅ new
      images,                            // ✅ new
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL BOOKS (Public)
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE BOOK
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// =======================
// UPDATE BOOK (Admin)
// =======================




exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Existing images sent from frontend
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    // New uploaded images
    const newImages = req.files?.map(
      file => `/uploads/${file.filename}`
    ) || [];

    book.title = req.body.title;
    book.author = req.body.author;
    book.price = req.body.price;
    book.stock = req.body.stock;
    book.description = req.body.description;
    book.images = [...existingImages, ...newImages];

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE BOOK (Admin)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// GET LOW STOCK BOOKS (Admin)
exports.getLowStockBooks = async (req, res) => {
  try {
    const lowStockBooks = await Book.find({ stock: { $lt: 5 } });
    res.json(lowStockBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
