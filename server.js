const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();



// MongoDB Connection
let dbConnectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
      })
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((error) => {
        dbConnectionPromise = null;
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  await dbConnectionPromise;
};

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

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

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






// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
