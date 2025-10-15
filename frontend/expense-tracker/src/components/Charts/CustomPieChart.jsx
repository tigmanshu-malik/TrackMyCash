import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";
import { addThousandsSeperator } from "../../utils/helper"; // Import the helper

// Default color palette for the pie chart
const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

const CustomPieChart = ({ data, label, totalAmount, colors = DEFAULT_COLORS, showTextAnchor }) => {
    // Ensure totalAmount is a number and format it
    const formattedTotal = typeof totalAmount === "number" 
        ? `₹${addThousandsSeperator(totalAmount.toFixed(2))}` 
        : totalAmount.replace(/[^0-9.-]+/g, "") ? `₹${addThousandsSeperator(parseFloat(totalAmount.replace(/[^0-9.-]+/g, "")).toFixed(2))}` : "₹0.00";

    // Dynamically adjust font size based on length of formattedTotal
    const getDynamicFontSize = (text) => {
        const length = text.length;
        return length > 8 ? "20px" : "24px"; // Reduce size for longer numbers
    };

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={300} className="md:h-[380px]">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110} // Reduced base radius
                        innerRadius={75}  // Reduced base radius
                        labelLine={false}
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={colors[index % colors.length]} 
                                stroke="#ffffff"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />
                    <Legend content={CustomLegend} />
                    {showTextAnchor && (
                        <>
                            <text
                                x="50%"
                                y="50%"
                                dy={-25}
                                textAnchor="middle"
                                fill="#4a4a4a"
                                fontSize="16px"
                                fontWeight={500}
                            >
                                {label}
                            </text>
                            <text
                                x="50%"
                                y="50%"
                                dy={10} // Adjusted offset to center better
                                textAnchor="middle"
                                fill="#2c3e50"
                                fontSize={getDynamicFontSize(formattedTotal)} // Dynamic font size
                                fontWeight={600}
                            >
                                {formattedTotal} {/* Use formatted value */}
                            </text>
                        </>
                    )}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomPieChart;