// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const plaidRoutes = require("./routes/plaidRoutes"); // ✅ Plaid integration
const pdfRoutes = require("./routes/pdfRoutes");     // ✅ PDF Upload + Parsing
require("./models/CardAccount"); // ✅ Add this line


const app = express();

// 🔐 Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// 🗂️ Static files (to access uploaded PDFs)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📦 Connect to MongoDB
connectDB();

// 🔁 All API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/plaid", plaidRoutes);
app.use("/api/v1/pdf", pdfRoutes); // ✅ PDF routes go here

// 🚀 Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
