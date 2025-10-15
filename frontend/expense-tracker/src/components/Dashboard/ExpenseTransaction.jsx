import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const ExpenseTransaction = ({ transactions, onSeeMore }) => {
    return (
        <div className="card p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-700">Expenses</h5>
                <button 
                    className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
                    onClick={onSeeMore}
                >
                    See All <LuArrowRight className="text-base mt-0.5" />
                </button>
            </div>
            
            <div className="mt-6">
                {transactions?.slice(0, 5).map((expense) => (
                    <TransactionInfoCard
                       key={expense._id}
                       title={expense.category}
                       icon={expense.icon}
                       date={moment(expense.date).format("DD MMM YYYY")}  // Changed data->date and format
                       amount={expense.amount}
                       type="expense"
                       hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseTransaction;