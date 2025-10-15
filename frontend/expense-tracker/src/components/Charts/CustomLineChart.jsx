import React from 'react';
import { 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid, 
    Area, 
    AreaChart, 
    Legend,
    ReferenceLine,
} from 'recharts';

const CustomLineChart = ({
    data = [],
    height = 300,
    strokeColor = '#875cf5',
    fillGradientStart = '#875cf5',
    fillGradientEnd = '#ab8df8',
    strokeWidth = 3,
    dotRadius = 3,
    showLegend = true,
    showReferenceLine = false,
    referenceValue = 0,
    isLoading = false,
}) => {
    // Custom Tooltip component with ₹ symbol
    const CustomToolTip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-purple-800 mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-gray-600">
                        Month: <span className="text-sm font-medium text-gray-900">{payload[0].payload.month}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="text-sm font-medium text-gray-900">₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Render loading state or empty message
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-4 text-center text-gray-500">
                Loading chart data...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg p-4 text-center text-gray-500">
                No data available to display.
            </div>
        );
    }

    // Define gradient
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for gradient
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={fillGradientStart} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={fillGradientEnd} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        stroke="#ddd" 
                        interval="preserveStartEnd"
                    />
                    <YAxis 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        stroke="#ddd"
                        domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomToolTip />} />
                    {showLegend && <Legend verticalAlign="top" height={36} />}
                    {showReferenceLine && (
                        <ReferenceLine 
                            y={referenceValue} 
                            stroke="#ff4444" 
                            strokeDasharray="3 3" 
                            label={{ value: `Target: ₹${referenceValue}`, position: 'right' }}
                        />
                    )}
                    <Area 
                        type="monotone" 
                        dataKey="amount"
                        stroke={strokeColor}
                        fill={`url(#${gradientId})`}
                        strokeWidth={strokeWidth}
                        dot={{ r: dotRadius, fill: fillGradientEnd }}
                        activeDot={{ r: 6, fill: strokeColor }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;