import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const IncomeList = ({ transactions, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return "No Date";
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.format("DD-MM-YYYY") : "Invalid Date";
  };

  const handleCSVDownload = () => {
    if (transactions.length === 0) return;

    const csvHeaders = ["Source", "Amount", "Date"];
    const csvRows = transactions.map((t) => [
      `"${t.source}"`,
      `"${t.amount}"`,
      `"${formatDate(t.date)}"`,
    ]);

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "income_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    doc.text("Income Report", 14, 16);
    const tableColumn = ["Source", "Amount (₹)", "Date"];
    const tableRows = [];

    transactions.forEach((tx) => {
      const rowData = [
        tx.source,
        tx.amount,
        formatDate(tx.date),
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "striped",
    });

    doc.save("income_data.pdf");
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-gray-800">Income Sources</h5>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
            onClick={handleCSVDownload}
          >
            <LuDownload className="text-base" />
            CSV
          </button>
          <button
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
            onClick={handlePDFDownload}
          >
            <LuDownload className="text-base" />
            PDF
          </button>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((income) => (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              date={formatDate(income.date)}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          No income entries yet. Add some income to see the list here.
        </p>
      )}
    </div>
  );
};

export default IncomeList;