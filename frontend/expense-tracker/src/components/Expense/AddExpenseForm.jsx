import React, { useState } from 'react';
import Input from "../Inputs/Input";
import EmojiPickerPopup from '../EmojiPickerPopup';
import toast from 'react-hot-toast';  

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });
    
    const handleChange = (key, value) => setExpense(prev => ({
        ...prev,
        [key]: value
    }));

    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />
            
            <Input
                value={expense.category}
                onChange={(value) => handleChange("category", value)}
                label="Category"
                placeholder="Rent, Groceries, e.t.c"
                type="text"
            />

            <Input
                value={expense.amount}
                onChange={(value) => handleChange("amount", value)}
                label="Amount"
                placeholder=""
                type="number"
            />

            <Input
                value={expense.date}
                onChange={(value) => handleChange("date", value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={() => onAddExpense(expense)}
                >
                    Add Expense
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;