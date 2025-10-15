import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [charData, setCharData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setCharData(result);
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Income Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track your earnings and analyze your income trends
          </p>
        </div>

        <button
          onClick={onAddIncome}
          className="flex items-center gap-2 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all"
        >
          <LuPlus className="text-base" />
          Add Income
        </button>
      </div>

      {/* Chart Section */}
      <div className="mt-8">
        <CustomBarChart data={charData} />
      </div>
    </div>
  );
};

export default IncomeOverview;
