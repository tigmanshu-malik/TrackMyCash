import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Model from "../../components/Model";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import toast from 'react-hot-toast';  
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
    const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);

    // Fetch all expenses
    const fetchExpenseDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
            if (response?.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expenses", error);
            toast.error("Something went wrong while fetching expenses.");
        } finally {
            setLoading(false);
        }
    };

    // Add new expense
    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon } = expense;

        if (!category.trim()) return toast.error("Category is required");
        if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Amount should be a valid number greater than 0");
        if (!date) return toast.error("Date is required");

        try {
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, { category, amount, date, icon });
            toast.success("Expense added successfully");
            setOpenAddExpenseModel(false);
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error adding expense", error);
            toast.error(error.response?.data?.message || "Failed to add expense.");
        }
    };

    // Delete an expense
    const handleDeleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
            toast.success("Expense deleted successfully");
            setOpenDeleteAlert({ show: false, data: null });
            fetchExpenseDetails(); // Fixed bug: previously called fetchIncomeDetails
        } catch (error) {
            console.error("Error deleting expense", error);
            toast.error(error.response?.data?.message || "Failed to delete expense.");
        }
    };

    // Download expenses to PDF
    const handleDownloadExpenseDetails = () => {
        const doc = new jsPDF();
        doc.text("Expense Details", 14, 16);

        const tableData = expenseData.map((exp, index) => [
            index + 1,
            exp.category,
            exp.amount,
            new Date(exp.date).toLocaleDateString(),
        ]);

        doc.autoTable({
            startY: 20,
            head: [["#", "Category", "Amount", "Date"]],
            body: tableData,
        });

        doc.save("expense-details.pdf");
    };

    useEffect(() => {
        fetchExpenseDetails();
    }, []);

    return (
        <DashboardLayout activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">

                    <ExpenseOverview
                        transactions={expenseData}
                        onExpenseIncome={() => setOpenAddExpenseModel(true)}
                    />

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>

                {/* Add Expense Modal */}
                <Model
                    isOpen={openAddExpenseModel}
                    onClose={() => setOpenAddExpenseModel(false)}
                    title="Add Expense"
                >
                    <AddExpenseForm onAddExpense={handleAddExpense} />
                </Model>

                {/* Delete Expense Confirmation Modal */}
                <Model
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense?"
                        onDelete={() => handleDeleteExpense(openDeleteAlert.data)}
                    />
                </Model>
            </div>
        </DashboardLayout>
    );
};

export default Expense;
