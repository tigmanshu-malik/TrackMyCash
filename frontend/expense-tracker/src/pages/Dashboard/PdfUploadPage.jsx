import { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa"; // For upload icon
import { toast, ToastContainer } from "react-toastify"; // For notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles

function PdfUploadPage() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("statement", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/pdf/upload-statement",
        formData
      );
      setTransactions(res.data.categorizedTransactions);
      toast.success("✅ Upload successful!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Colors for transaction categories
  const categoryColors = {
    income: "bg-green-100 text-green-800",
    expense: "bg-red-100 text-red-800",
    transfer: "bg-blue-100 text-blue-800",
    other: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 animate-blob delay-2000"></div>

      <div className="max-w-2xl w-full mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Upload Bank Statement
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full flex items-center justify-center px-6 py-3 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-300 ${
            file ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed animate-pulse"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-2 border-white border-solid rounded-full animate-spin"></div>
          ) : (
            <>
              <FaUpload className="mr-2" /> Upload & Parse PDF
            </>
          )}
        </button>

        {transactions && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Categorized Transactions
            </h3>
            {Object.entries(transactions).map(([category, txList]) => (
              <div
                key={category}
                className={`mb-6 p-4 rounded-xl shadow-md ${
                  categoryColors[category] || "bg-gray-100 text-gray-800"
                }`}
              >
                <h4 className="capitalize font-bold text-lg mb-2">
                  {category}
                </h4>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  {txList.length > 0 ? (
                    txList.map((tx, idx) => (
                      <li key={idx} className="text-gray-700">
                        {tx}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No transactions</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default PdfUploadPage;