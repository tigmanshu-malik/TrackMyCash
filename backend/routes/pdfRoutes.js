const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadPDF } = require("../controllers/pdfController");

// Change route here:
router.post("/upload-statement", upload.single("pdfFile"), uploadPDF);

module.exports = router;
