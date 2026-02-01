const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//Auth route
app.use("/api/auth", require("./routes/authRoutes"));

// Book routes
app.use("/api/books", require("./routes/bookRoutes"));

// Order route
app.use("/api/orders", require("./routes/orderRoutes"));
//image upload route
app.use("/uploads", express.static("uploads"));





// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
