import React from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const ExpenseList = ({ transactions = [], onDelete }) => {
  // Handle CSV download
  const handleDownloadCSV = () => {
    if (transactions.length === 0) return;

    const data = transactions.map(exp => ({
      Category: exp.category,
      Amount: exp.amount,
      Date: moment(exp.date, moment.ISO_8601, true).isValid()
        ? moment(exp.date).format('YYYY-MM-DD')
        : 'N/A',
      Icon: exp.icon || '',
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses.csv');
    link.click();
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (transactions.length === 0) return;

    const doc = new jsPDF();
    doc.text('Expense Report', 14, 15);

    const tableData = transactions.map(exp => [
      exp.category,
      exp.amount,
      moment(exp.date, moment.ISO_8601, true).isValid()
        ? moment(exp.date).format('YYYY-MM-DD')
        : 'N/A',
      exp.icon || '',
    ]);

    autoTable(doc, {
      head: [['Category', 'Amount', 'Date', 'Icon']],
      body: tableData,
      startY: 20,
    });

    doc.save('expenses.pdf');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-semibold text-gray-800">All Expenses</h5>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md shadow transition-all"
            onClick={handleDownloadCSV}
            disabled={transactions.length === 0}
          >
            <LuDownload className="text-base" />
            CSV
          </button>
          <button
            className="flex items-center gap-1 text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md shadow transition-all"
            onClick={handleDownloadPDF}
            disabled={transactions.length === 0}
          >
            <LuDownload className="text-base" />
            PDF
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No expenses recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map(expense => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={expense.date} // ✅ Pass raw date
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
