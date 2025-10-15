// src/components/PdfUpload.jsx
import { useState } from "react";
import axios from "axios";

function PdfUpload({ setTransactions }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");
    setUploading(true);

    const formData = new FormData();
    formData.append("statement", file); // <-- Match this with backend

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/pdf/upload-statement",
        formData
      );
      setTransactions(res.data.categorizedTransactions);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-lg space-y-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-white file:text-gray-700 hover:file:bg-gray-100"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}

export default PdfUpload;
