import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const [charData, setCharData] = useState([]);
    
    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount,
        }));
        setCharData(dataArr);
    };

    useEffect(() => {
        prepareChartData();
        return () => {};
    }, [data]);

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Last 60 Days Income</h5>
            </div>
            <CustomPieChart
                data={charData}
                label="Total Income"
                totalAmount={`$${totalIncome}`}
                showTextAnchor={true}
                colors={COLORS}
            />
        </div>
    );
};

export default RecentIncomeWithChart;