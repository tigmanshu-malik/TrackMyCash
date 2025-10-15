// src/components/Dashboard/Last30DaysExpenses.jsx
import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses = ({ data }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseBarChartData(data);
        setChartData(result);
    }, [data]);

    return (
        <div className="card col-span-1 p-4 bg-white rounded-lg shadow-sm h-[400px]">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Last 30 Days Expenses</h5>
            </div>
            <div className="h-[calc(100%-50px)]">
                <CustomBarChart data={chartData} />
            </div>
        </div>
    );
};

export default Last30DaysExpenses;