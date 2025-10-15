import React, { memo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

// Custom Tooltip Component with enhanced details
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="bg-white p-3 border border-purple-200 rounded-lg shadow-md text-sm"
                role="tooltip"
                aria-label={`Tooltip for ${label}`}
            >
                <p className="font-medium text-purple-700">{label}</p>
                <p className="text-purple-600 font-semibold">
                    {`₹${payload[0].value.toLocaleString()}`}
                </p>
                {payload[0].payload.date && (
                    <p className="text-gray-600 text-xs">
                        Date: {payload[0].payload.date}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

// Enhanced CustomBarChart Component
const CustomBarChart = ({
    data = [],
    height = 300,
    barColor = "#a855f7",
    secondaryBarColor = "#34d399", // For multiple bars (e.g., green for secondary data)
    margin = { top: 20, right: 30, left: 20, bottom: 40 },
    dataKey = "amount",
    secondaryDataKey = null,
    onBarClick = () => {}, // Callback for bar click
    showLegend = true,
    isLoading = false,
}) => {
    // Handle empty or invalid data
    if (isLoading) {
        return (
            <div className="text-center p-4 text-gray-500" role="alert">
                Loading chart data...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center p-4 text-gray-500" role="alert">
                No data available to display.
            </div>
        );
    }

    // Custom bar click handler with data
    const handleBarClick = (data, index) => {
        onBarClick(data, index);
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                margin={margin}
                barCategoryGap={10} // Space between bars
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                    dataKey="month"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 12, fill: "#555" }}
                    stroke="#ddd"
                    aria-label="Month axis"
                />
                <YAxis
                    tick={{ fontSize: 12, fill: "#555" }}
                    stroke="#ddd"
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    aria-label="Amount axis"
                />
                <Tooltip content={<CustomTooltip />} />
                {showLegend && <Legend verticalAlign="top" height={36} />}
                <Bar
                    dataKey={dataKey}
                    name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} // Simplified name
                    fill={barColor}
                    radius={[8, 8, 0, 0]}
                    barSize={20}
                    animationBegin={0}
                    animationDuration={1000} // Smooth animation
                    onClick={handleBarClick}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={barColor}
                            cursor="pointer"
                            onClick={() => handleBarClick(entry, index)}
                        />
                    ))}
                </Bar>
                {secondaryDataKey && (
                    <Bar
                        dataKey={secondaryDataKey}
                        name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)} // Simplified name
                        fill={secondaryBarColor}
                        radius={[8, 8, 0, 0]}
                        barSize={20}
                        animationBegin={0}
                        animationDuration={1000}
                        onClick={handleBarClick}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}-secondary`}
                                fill={secondaryBarColor}
                                cursor="pointer"
                                onClick={() => handleBarClick(entry, index)}
                            />
                        ))}
                    </Bar>
                )}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default memo(CustomBarChart); // Memoize to prevent unnecessary re-renders