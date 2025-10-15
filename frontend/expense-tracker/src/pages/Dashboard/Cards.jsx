import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, RefreshCw } from "lucide-react";
import PlaidLinkButton from "./PlaidLinkButton";
import { Link, useLocation } from "react-router-dom";

const Cards = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchAccounts = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/plaid/get-accounts", {
        access_token: token,
      });
      if (response.data.accounts && Array.isArray(response.data.accounts)) {
        setAccounts(response.data.accounts);
        await Promise.all(
          response.data.accounts.map((acc) =>
            fetchTransactions(token, acc.account_id)
          )
        );
      } else {
        setError("No valid accounts found in response.");
      }
    } catch (err) {
      setError(`Failed to fetch accounts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (token, accountId) => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/plaid/get-transactions", {
        access_token: token,
        account_id: accountId,
        start_date: "2024-04-01",
        end_date: new Date().toISOString().split("T")[0],
      });
      setTransactions((prev) => ({
        ...prev,
        [accountId]: response.data.transactions || [],
      }));
    } catch (err) {
      console.error(`Error fetching transactions for ${accountId}:`, err.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAccounts(accessToken);
    }
  }, [accessToken]);

  const handleRefresh = () => {
    if (accessToken) fetchAccounts(accessToken);
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/cards", label: "Cards & Accounts" },
    { path: "/income", label: "Income" },
  ];

  const bankAccounts = accounts.filter(
    (acc) => acc.type === "depository" && acc.subtype !== "credit card"
  );
  const cardAccounts = accounts.filter(
    (acc) => acc.type === "credit" || acc.subtype === "credit card"
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-purple-200 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-blue-200 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 animate-blob delay-2000"></div>

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-full p-6 z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 text-gray-700 rounded-lg mb-2 hover:bg-blue-100 transition duration-200 ${
                location.pathname === item.path ? "bg-blue-200 font-semibold" : ""
              }`}
              onClick={() => console.log(`Navigating to ${item.path}`)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 relative z-10">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <div className="flex items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mr-4">
              💳 Linked Cards & Accounts
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50"
              disabled={loading}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
            <PlaidLinkButton
              onSuccessLink={(token) => {
                setAccessToken(token); // Assuming PlaidLinkButton returns the access_token after exchange
              }}
              className={accounts.length === 0 ? "animate-pulse" : ""}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            {error}
            <button
              onClick={handleRefresh}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <RefreshCw className="inline w-5 h-5" /> Retry
            </button>
          </div>
        ) : accounts.length === 0 ? (
          <p className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-md p-6">
            No accounts linked yet. Click the Plaid button to link an account!
          </p>
        ) : (
          <div>
            {/* Bank Accounts Section */}
            {bankAccounts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Bank Accounts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {bankAccounts.map((acc) => (
                    <div
                      key={acc.account_id}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200"
                    >
                      <div className="flex items-center mb-4">
                        <CreditCard className="text-blue-500 w-6 h-6 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">
                          {acc.name || "Unnamed Account"}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Type:</span>{" "}
                          {acc.type || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Subtype:</span>{" "}
                          {acc.subtype || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Mask:</span>{" "}
                          ****{acc.mask || "----"}
                        </p>
                        <p className="text-sm mt-2 font-medium text-green-600">
                          <span className="font-medium text-gray-800">Available Balance:</span>{" "}
                          {typeof acc.balances?.available === "number"
                            ? `$${acc.balances.available.toFixed(2)}`
                            : "N/A"}
                        </p>
                        <p className="text-sm text-blue-600">
                          <span className="font-medium text-gray-800">Current Balance:</span>{" "}
                          {typeof acc.balances?.current === "number"
                            ? `$${acc.balances.current.toFixed(2)}`
                            : "N/A"}
                        </p>
                      </div>
                      {transactions[acc.account_id] &&
                        transactions[acc.account_id].length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-md font-medium text-gray-700 mb-2">
                              Recent Transactions
                            </h4>
                            <ul className="text-sm text-gray-600 max-h-32 overflow-y-auto space-y-1">
                              {transactions[acc.account_id].map((tx, idx) => (
                                <li key={idx}>
                                  {tx.date} - {tx.name} ({tx.amount > 0 ? "+" : "-"}$
                                  {Math.abs(tx.amount).toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card Accounts Section */}
            {cardAccounts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Credit/Debit Cards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {cardAccounts.map((acc) => (
                    <div
                      key={acc.account_id}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200"
                    >
                      <div className="flex items-center mb-4">
                        <CreditCard className="text-purple-500 w-6 h-6 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">
                          {acc.name || "Unnamed Card"}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Type:</span>{" "}
                          {acc.type || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Subtype:</span>{" "}
                          {acc.subtype || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Mask:</span>{" "}
                          ****{acc.mask || "----"}
                        </p>
                        <p className="text-sm mt-2 font-medium text-red-600">
                          <span className="font-medium text-gray-800">Limit:</span>{" "}
                          {typeof acc.balances?.limit === "number"
                            ? `$${acc.balances.limit.toFixed(2)}`
                            : "N/A"}
                        </p>
                        <p className="text-sm text-blue-600">
                          <span className="font-medium text-gray-800">Current Balance:</span>{" "}
                          {typeof acc.balances?.current === "number"
                            ? `$${acc.balances.current.toFixed(2)}`
                            : "N/A"}
                        </p>
                      </div>
                      {transactions[acc.account_id] &&
                        transactions[acc.account_id].length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-md font-medium text-gray-700 mb-2">
                              Recent Transactions
                            </h4>
                            <ul className="text-sm text-gray-600 max-h-32 overflow-y-auto space-y-1">
                              {transactions[acc.account_id].map((tx, idx) => (
                                <li key={idx}>
                                  {tx.date} - {tx.name} ({tx.amount > 0 ? "+" : "-"}$
                                  {Math.abs(tx.amount).toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cardAccounts.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No credit/debit cards found. Ensure your institution supports card
                data or link a new account.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;