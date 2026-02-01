const Order = require("../models/Order");
const Book = require("../models/Book");

// PLACE ORDER + AUTO REDUCE STOCK
exports.placeOrder = async (req, res) => {
  const { items } = req.body;

  try {
    let totalAmount = 0;

    // 1️⃣ CHECK STOCK
    for (let item of items) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `${book.title} is out of stock`
        });
      }

      totalAmount += book.price * item.quantity;
    }

    // 2️⃣ REDUCE STOCK
    for (let item of items) {
      const book = await Book.findById(item.bookId);
      book.stock -= item.quantity;
      await book.save();
    }

    // 3️⃣ CREATE ORDER
    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET LOGGED-IN USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.bookId", "title author price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email role")
      .populate("items.bookId", "title price images description")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
