import React from "react";

// Utility to format number with commas
const formatAmount = (amount) => {
    return amount?.toLocaleString("en-IN"); // Indian number system format
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];

        return (
            <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200">
                <p className="text-sm font-semibold text-purple-700 mb-1">
                    {name}
                </p>
                <p className="text-gray-600 text-sm">
                    Amount:{" "}
                    <span className="font-bold text-gray-900">
                        ₹{formatAmount(value)}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
