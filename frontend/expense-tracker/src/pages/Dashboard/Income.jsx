import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Model from "../../components/Model";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
    const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);

    // ✅ Fetch All Income Details
    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
            if (response.data) setIncomeData(response.data);
        } catch (error) {
            console.error("Something went wrong. Please try again.", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Add Income
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // Validation Checks
        if (!source.trim()) return toast.error("Source is required");
        if (!amount || isNaN(amount) || Number(amount) <= 0)
            return toast.error("Amount should be a valid number greater than 0");
        if (!date) return toast.error("Date is required");

        try {
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, { source, amount, date, icon });
            setOpenAddIncomeModel(false);
            toast.success("Income added successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error adding income", error.response?.data?.message || error.message);
        }
    };

    // ✅ Delete Income
    const DeleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income details deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error deleting income", error.response?.data?.message || error.message);
        }
    };

    // ✅ Handle Download Income Details (To Be Implemented)
    const handleDownloadIncomeDetails = async () => {};

    // Fetch data on mount
    useEffect(() => {
        fetchIncomeDetails();
    }, []);

    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {/* Income Overview Section */}
                    <IncomeOverview
                        transactions={incomeData}
                        onAddIncome={() => setOpenAddIncomeModel(true)}
                    />

                    {/* Income List Section */}
                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onDownload={handleDownloadIncomeDetails}
                    />
                </div>

                {/* Add Income Modal */}
                <Model isOpen={openAddIncomeModel} onClose={() => setOpenAddIncomeModel(false)} title="Add Income">
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Model>

                {/* Delete Income Modal */}
                <Model isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({ show: false, data: null })} title="Delete Income">
                    <DeleteAlert content="Are you sure you want to delete this income detail?" onDelete={() => DeleteIncome(openDeleteAlert.data)} />
                </Model>
            </div>
        </DashboardLayout>
    );
};

export default Income;
