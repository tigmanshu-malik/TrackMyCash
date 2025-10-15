import React, { useMemo, useState } from "react";
import { LuArrowRight, LuDownload } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const RecentTransactions = ({ transactions = [], onSeeMore }) => {
  const [selectedMonth, setSelectedMonth] = useState(moment().format("YYYY-MM"));

  // Supported date formats for parsing
  const dateFormats = [
    "YYYY-MM-DD",
    "YYYY-MM-DDTHH:mm:ss.SSSZ", // ISO format
    "DD MMM YYYY", // "02 Apr 2025"
    "DD-MM-YYYY",
    "MM/DD/YYYY",
    moment.ISO_8601
  ];

  // Filter transactions by selected month with proper date handling
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (!tx.date) return false;
        const txDate = moment(tx.date, dateFormats, true);
        return txDate.isValid() && txDate.format("YYYY-MM") === selectedMonth;
      })
      .sort((a, b) => {
        const dateA = moment(a.date, dateFormats, true);
        const dateB = moment(b.date, dateFormats, true);
        return dateB.diff(dateA); // Newest first
      });
  }, [transactions, selectedMonth, dateFormats]);

  // Generate unique months from all valid dates
  const uniqueMonths = useMemo(() => {
    const months = new Set();
    
    transactions.forEach((tx) => {
      if (!tx.date) return;
      const txDate = moment(tx.date, dateFormats, true);
      if (txDate.isValid()) {
        months.add(txDate.format("YYYY-MM"));
      }
    });

    return Array.from(months)
      .sort((a, b) => moment(b).diff(moment(a))); // Newest first
  }, [transactions, dateFormats]);

  const handleDownload = () => {
    const rows = filteredTransactions.map((tx) => {
      const txDate = moment(tx.date, dateFormats, true);
      return {
        Date: txDate.isValid() ? txDate.format("YYYY-MM-DD") : "Invalid Date",
        Type: tx.type || "Unknown",
        Category: tx.name || tx.merchant_name || tx.category || tx.source || "Unknown",
        Amount: tx.amount || 0,
      };
    });

    const csvContent = [
      "Date,Type,Category,Amount",
      ...rows.map(row => `${row.Date},${row.Type},${row.Category},${row.Amount}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-4 sm:p-6">
      {/* Header with title, month selector, and download button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-6">
        <h5 className="text-xl font-semibold text-gray-900">Recent Transactions</h5>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Select month"
          >
            {uniqueMonths.map((month) => (
              <option key={month} value={month}>
                {moment(month, "YYYY-MM").format("MMMM YYYY")}
              </option>
            ))}
          </select>

          <button
            className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105"
            onClick={handleDownload}
            aria-label="Download transactions"
          >
            <LuDownload className="text-lg group-hover:animate-pulse" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Transaction list */}
      <div className="mt-2 space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.slice(0, 5).map((item, index) => (
            <TransactionInfoCard
              key={item._id || `tx-${index}`}
              title={
                item.name ||
                item.merchant_name ||
                (item.type === "expense" ? item.category || item.source : item.source) ||
                "Unknown Transaction"
              }
              icon={item.icon}
              date={item.date}
              amount={item.amount || 0}
              type={item.type}
              hideDeleteBtn
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            No transactions for {moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}
          </p>
        )}
      </div>

      {/* "See All" button (only shown if there are more than 5 transactions) */}
      {filteredTransactions.length > 5 && onSeeMore && (
        <div className="text-center mt-6">
          <button
            className="text-sm text-purple-600 hover:underline flex items-center gap-1 mx-auto"
            onClick={onSeeMore}
            aria-label="See all transactions"
          >
            See All <LuArrowRight className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;