const fs = require("fs");
const pdfParse = require("pdf-parse");

const categoryKeywords = {
  grocery: ["grocery", "big bazaar", "groceries"],
  rent: ["rent"],
  shopping: ["flipkart", "amazon", "shopping", "electronics"],
  travel: ["uber", "ola", "transport", "petrol", "fuel"],
  food: ["swiggy", "zomato", "restaurant", "dining", "food"],
  income: ["salary", "credit"],
};

const skipLines = [
  "monthly bank statement",
  "statement period",
  "datedescriptioncategoryamount",
  "page"
];

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);

    const lines = data.text.split("\n").map(line => line.trim());
    const categorized = {
      grocery: [],
      rent: [],
      shopping: [],
      travel: [],
      food: [],
      income: [],
      others: [],
    };

    lines.forEach(line => {
      if (!line) return;

      // Skip unwanted header/footer lines
      const lowerLine = line.toLowerCase();
      if (skipLines.some(header => lowerLine.includes(header))) return;

      let matched = false;

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          if (lowerLine.includes(keyword)) {
            categorized[category].push(line);
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      if (!matched) {
        categorized.others.push(line);
      }
    });

    res.status(200).json({ categorizedTransactions: categorized });
  } catch (error) {
    console.error("PDF parsing error:", error);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
};
