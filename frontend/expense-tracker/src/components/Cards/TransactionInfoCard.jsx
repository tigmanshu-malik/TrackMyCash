import React, { memo } from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash,
} from "react-icons/lu";
import moment from "moment";

const DefaultIcon = <LuUtensils className="w-6 h-6 text-gray-500" />;

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn = false,
  onDelete = () => {},
}) => {
  const isIncome = type === "income";

  // Date formatting with explicit format support
  const getFormattedDate = (date) => {
    if (!date) return "No Date";

    // Supported date formats
    const supportedFormats = [
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm:ss.SSSZ", // ISO format
      "DD MMM YYYY", // "02 Apr 2025"
      "DD-MM-YYYY",
      "MM/DD/YYYY",
      moment.ISO_8601
    ];

    // Try parsing with strict format checking
    const parsedDate = moment(date, supportedFormats, true);
    
    if (parsedDate.isValid()) {
      return parsedDate.format("Do MMM YYYY"); // "2nd Apr 2025"
    }

    return "Invalid Date";
  };

  // Rest of your component remains the same
  return (
    <div className="group relative flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full shadow-inner">
        {icon ? (
          <img
            src={icon}
            alt={title}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.appendChild(DefaultIcon);
            }}
          />
        ) : (
          DefaultIcon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{getFormattedDate(date)}</p>
        </div>

        <div className="flex items-center gap-3">
          {!hideDeleteBtn && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <LuTrash className="w-4 h-4" />
            </button>
          )}

          <div
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ${
              isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            <span>{isIncome ? "+" : "-"} ₹{amount.toLocaleString()}</span>
            {isIncome ? (
              <LuTrendingUp className="w-4 h-4" />
            ) : (
              <LuTrendingDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TransactionInfoCard);