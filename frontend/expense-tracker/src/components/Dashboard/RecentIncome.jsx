import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const RecentIncome = ({ transactions, onSeeMore }) => {
    return (
        <div className="card p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Income</h5>
                <button 
                    className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
                    onClick={onSeeMore}
                >
                    See All <LuArrowRight className="text-base mt-0.5" />
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {transactions?.slice(0, 5)?.map((item, index) => (
                    <TransactionInfoCard
                        key={item.id || `income-${index}`}  // Fallback key
                        title={item.source}
                        icon={item.icon}
                        date={moment(item.date).format("DD MMM YYYY")}  // Better date format
                        amount={item.amount}
                        type="income"
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentIncome;