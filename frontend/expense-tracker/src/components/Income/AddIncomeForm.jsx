import React, { useState } from 'react';
import Input from "../Inputs/Input";
import EmojiPickerPopup from '../EmojiPickerPopup';
import toast from 'react-hot-toast';

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        setIncome(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = () => {
        if (!income.source.trim()) {
            toast.error("Income source is required");
            return;
        }
        if (!income.amount || isNaN(income.amount) || Number(income.amount) <= 0) {
            toast.error("Amount must be a valid number greater than 0");
            return;
        }
        if (!income.date) {
            toast.error("Date is required");
            return;
        }

        onAddIncome(income);
        toast.success("Income added successfully!");

        // Reset form
        setIncome({
            source: "",
            amount: "",
            date: "",
            icon: "",
        });
    };

    return (
        <div className="space-y-5">
            {/* Emoji Picker */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Choose Icon
                </label>
                <EmojiPickerPopup
                    icon={income.icon}
                    onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
                />
            </div>

            {/* Input Fields */}
            <Input
                value={income.source}
                onChange={(value) => handleChange("source", value)}
                label="Income Source"
                placeholder="Freelance, Salary, etc."
                type="text"
            />

            <Input
                value={income.amount}
                onChange={(value) => handleChange("amount", value)}
                label="Amount"
                placeholder="Enter amount"
                type="number"
            />

            <Input
                value={income.date}
                onChange={(value) => handleChange("date", value)}
                label="Date"
                placeholder="Select date"
                type="date"
            />

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill px-6 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition-all duration-200"
                    onClick={handleSubmit}
                >
                    Add Income
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;
