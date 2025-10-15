import React, { useEffect, useState } from 'react';
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h5 className="text-xl font-semibold text-gray-800">Expense Overview</h5>
                    <p className="text-sm text-gray-500 mt-1">
                        Track your spending trends and gain insights into where your money goes.
                    </p>
                </div>

                <button
                    className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow transition-all"
                    onClick={onExpenseIncome}
                >
                    <LuPlus className="text-base" />
                    Add Expense
                </button>
            </div>

            <div className="mt-6">
                {chartData.length > 0 ? (
                    <CustomLineChart data={chartData} />
                ) : (
                    <div className="text-center text-gray-400 text-sm mt-4">
                        No expense data available yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseOverview;
