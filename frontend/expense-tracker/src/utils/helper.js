import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email); 
};

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let intials = "";
    
    for (let i = 0; i<Math.min(words.length, 2); i++) {
        intials += words[i][0];
    }
    return intials.toUpperCase();
    };

export const addThousandsSeperator = (num) => {
        if (num == null || isNaN(num)) return "";
        
        const [integerPart, fractionalPart] = num.toString().split(".");
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        return fractionalPart
            ? `${formattedInteger}.${fractionalPart}`
            : formattedInteger;
    };

export const prepareExpenseBarChartData = (data = []) => {
        const chartData = data.map(item => ({
            category: item.category,
            amount: item.amount,
        }));
        return chartData;
};
export const prepareIncomeBarChartData = (data = []) => {
  const groupedByMonth = {};

  data.forEach((item) => {
    const monthKey = moment(item?.date).format("MMM YYYY");
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = 0;
    }
    groupedByMonth[monthKey] += item?.amount || 0;
  });

  // Convert grouped data into chart format
  const chartData = Object.entries(groupedByMonth).map(([month, amount]) => ({
    month,
    amount,
  }));

  // Sort by chronological order
  chartData.sort((a, b) => moment(a.month, "MMM YYYY").toDate() - moment(b.month, "MMM YYYY").toDate());

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('DD MMM'),
        amount: item?.amount,
        category: item?.category,
    }));

    return chartData;  
};