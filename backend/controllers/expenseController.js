const xlsx = require('xlsx');
const Expense = require("../models/Expense");

// Add Expense Source 
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

  try{
    const { icon, category, amount, date } = req.body;

    //Validation Check of Missing Fields
    if (!category || !amount || !date) {
        return res.status(400).json({message:"All fields are required"});
    }

    const newExpense = new Expense({
        userId,
        icon,
        category,
        amount,
        date: new Date(date)
    });

    await newExpense.save();
    res.status(200).json(newExpense);
} catch (error) {
    console.error("Error in addExpense:", error.message);
    res.status(500).json({ message: "Server Error"});
}

}

// Get All Expense Source 
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

  try{
    const expense = await Expense.find({ userId }).sort({ date: -1});
    res.json(expense);
  } catch (error) {
      res.status(500).json({ message: "Server Error"})
  }
}

// Delete Expense Source 
exports.deleteExpense = async (req, res) => {
  try{
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted Successfully"});
    } catch (error) {
        console.error("Error in DeleteIncome:", error.message);
        res.status(500).json({message: "Server Error"});
  }
};

// Download Income Source 
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
  try{
    const expense = await Expense.find({ userId}).sort({ date: -1});

    //Prepare data for Excel
    const data = expense.map((item) => ({
        category: item.category,
        Amount: item.amount,
        Date: item.date,
    }));
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, 'income_details.xlsx');
    res.download('income_details.xlsx');
} catch (error) {
    res.status(500).json({ message: "Server Error"});
}
};
