// controllers/plaidController.js
const plaidClient = require("../config/plaidClient");

let access_token = null; // For demo only, consider saving in DB for real apps

// Generate link token
const createLinkToken = async (req, res) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: "user-123" },
      client_name: "Expense Tracker",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
    });

    res.json({ link_token: tokenResponse.data.link_token });
  } catch (error) {
    console.error("Link token error", error);
    res.status(500).json({ error: "Unable to create link token" });
  }
};

// Exchange public_token for access_token
const exchangePublicToken = async (req, res) => {
  const { public_token } = req.body;

  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    access_token = response.data.access_token;
    res.json({ access_token });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
};

// Get accounts linked to access_token
const getAccounts = async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const response = await plaidClient.accountsGet({ access_token });
    res.json(response.data);
  } catch (error) {
    console.error("Plaid get-accounts error:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

// Get transactions within date range for access_token
const getTransactions = async (req, res) => {
  const { start_date, end_date, access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date,
      end_date,
      options: { count: 10, offset: 0 },
    });

    res.json({ transactions: response.data.transactions });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

module.exports = {
  createLinkToken,
  exchangePublicToken,
  getAccounts,
  getTransactions,
};