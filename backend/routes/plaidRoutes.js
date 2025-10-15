// 📁 backend/routes/plaidRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Import all controller functions
const {
  exchangePublicToken,
  getAccounts,
  getTransactions,
  createLinkToken,
} = require("../controllers/plaidController");

// ✅ Define all necessary Plaid routes
router.post("/exchange-public-token", exchangePublicToken);
router.post("/get-accounts", getAccounts);
router.post("/get-transactions", getTransactions);
router.get("/create-link-token", createLinkToken); // ✅ Fix was here

module.exports = router;
