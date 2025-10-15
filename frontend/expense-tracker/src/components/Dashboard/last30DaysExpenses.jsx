import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses = ({
    data = [],
    height = 400,
    barColor = "#875cf5",
    backgroundColor = "#ffffff",
    showLegend = true,
    isLoading: propLoading = false,
}) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(propLoading);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format. Expected an array.");
                }
                const result = prepareExpenseBarChartData(data);
                if (!result || result.length === 0) {
                    throw new Error("No data available after processing.");
                }
                setChartData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [data]);

    // Render loading, error, or chart
    if (isLoading) {
        return (
            <div
                className="card col-span-1 p-4 bg-white rounded-lg shadow-sm h-[400px] flex items-center justify-center"
                style={{ backgroundColor }}
            >
                <p className="text-gray-500">Loading expenses data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="card col-span-1 p-4 bg-white rounded-lg shadow-sm h-[400px] flex items-center justify-center"
                style={{ backgroundColor }}
            >
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div
            className="card col-span-1 p-4 bg-white rounded-lg shadow-sm"
            style={{ backgroundColor, minHeight: `${height}px` }}
        >
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Last 30 Days Expenses</h5>
            </div>
            <div className="h-[calc(100%-50px)]">
                <CustomBarChart
                    data={chartData}
                    height={height - 50} // Adjust for header height
                    barColor={barColor}
                    showLegend={showLegend}
                    tooltipFormatter={(value) => `₹${value}`} // Format tooltip with ₹
                />
            </div>
        </div>
    );
};

export default Last30DaysExpenses;