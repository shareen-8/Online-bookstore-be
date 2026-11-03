const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
const allowedOrigins = [
  "https://online-bookstore-fe.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
