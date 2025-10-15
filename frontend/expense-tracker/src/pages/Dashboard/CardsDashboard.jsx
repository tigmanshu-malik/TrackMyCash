import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import InfoCard from "../../components/Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal, LuRefreshCw } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeperator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import { useNavigate } from "react-router-dom";
import PlaidLinkButton from "./PlaidLinkButton";

const CardsDashboard = () => {
  const { accessToken, updateAccessToken, user } = useUserAuth() || {}; // Fallback works
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const expenseChartRef = useRef(null);
  const balanceChartRef = useRef(null);

  // Calculate totals and displayName at the top
  const totalBalance = cardData?.accounts?.reduce(
    (sum, acc) => sum + (acc.balances?.current || 0),
    0
  ) || 0;
  const totalCreditLimit = cardData?.accounts
    ?.filter((acc) => acc.type === "credit")
    .reduce((sum, acc) => sum + (acc.balances?.limit || 0), 0) || 0;
  const totalExpense = cardData?.accounts
    ?.reduce((sum, acc) => {
      const accTransactions = cardData?.transactions?.[acc.account_id] || [];
      return sum + accTransactions.reduce((txSum, tx) => txSum + (tx.amount || 0), 0);
    }, 0) || 0;
  const displayName = cardData?.fullName || user?.fullName || user?.name || "User";

  useEffect(() => {
    if (accessToken) {
      fetchCardData();
    } else {
      console.log("No access token available. Please link Plaid account.");
      setError("No access token available. Please link Plaid account.");
      setLoading(false);
    }
  }, [accessToken]);

  const fetchCardData = async () => {
    setLoading(true);
    try {
      console.log("Fetching accounts with accessToken:", accessToken);
      const accountsResponse = await axiosInstance.post(API_PATHS.PLAID.GET_ACCOUNTS, {
        access_token: accessToken,
      }, {
        headers: { "Content-Type": "application/json" },
      }).catch(error => {
        console.log("Request Config:", error.config);
        console.log("Response Data:", error.response?.data);
        throw error;
      });
      const accounts = accountsResponse.data.accounts || [];

      const transactionsPromises = accounts.map((acc) =>
        axiosInstance.post(API_PATHS.PLAID.GET_TRANSACTIONS, {
          access_token: accessToken,
          account_id: acc.account_id,
          start_date: "2024-04-01",
          end_date: new Date().toISOString().split("T")[0],
        })
      );
      const transactionsResponses = await Promise.all(transactionsPromises);
      const allTransactions = transactionsResponses.reduce((acc, resp, idx) => {
        acc[accounts[idx].account_id] = resp.data.transactions || [];
        return acc;
      }, {});

      setCardData({ accounts, transactions: allTransactions });
      setError(null);
    } catch (error) {
      console.error("Error fetching card data:", error);
      console.log("Full Error:", error.toJSON());
      setError(`Failed to load card data: ${error.message}`);
      setCardData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidLinkSuccess = (accessToken) => {
    console.log("Plaid Link Success, received accessToken:", accessToken);
    updateAccessToken(accessToken); // Update context and localStorage
  };

  useEffect(() => {
    if (cardData && expenseChartRef.current && balanceChartRef.current) {
      if (expenseChartRef.current.chart) expenseChartRef.current.chart.destroy();
      if (balanceChartRef.current.chart) balanceChartRef.current.chart.destroy();

      const expenseCtx = expenseChartRef.current.getContext("2d");
      expenseChartRef.current.chart = new Chart(expenseCtx, {
        type: "bar",
        data: {
          labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
          datasets: [{
            label: "Expenses (₹)",
            data: [
              Math.abs(totalExpense / 5).toFixed(2),
              Math.abs(totalExpense / 5).toFixed(2),
              Math.abs(totalExpense / 5).toFixed(2),
              Math.abs(totalExpense / 5).toFixed(2),
              Math.abs(totalExpense / 5).toFixed(2),
            ],
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
          }],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { labels: { color: "#4B5563" } } },
        },
      });

      const balanceCtx = balanceChartRef.current.getContext("2d");
      balanceChartRef.current.chart = new Chart(balanceCtx, {
        type: "pie",
        data: {
          labels: ["Total Balance", "Credit Limit"],
          datasets: [{
            data: [totalBalance.toFixed(2), totalCreditLimit.toFixed(2)],
            backgroundColor: ["rgba(147, 51, 234, 0.8)", "rgba(34, 197, 94, 0.8)"],
            borderWidth: 1,
          }],
        },
        options: {
          plugins: { legend: { position: "bottom", labels: { color: "#4B5563" } } },
        },
      });
    }
  }, [cardData, totalBalance, totalCreditLimit, totalExpense]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Cards">
        <div className="text-center py-10 text-gray-600 animate-pulse text-xl font-medium">
          Loading your financial data...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !cardData) {
    return (
      <DashboardLayout activeMenu="Cards">
        <div className="text-red-500 text-center py-10">
          <p className="text-lg font-semibold mb-4">{error}</p>
          {!accessToken && <PlaidLinkButton onSuccess={handlePlaidLinkSuccess} />}
          <button
            onClick={fetchCardData}
            className="ml-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            <LuRefreshCw className="mr-2 w-5 h-5" /> Refresh
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Cards">
      <div className="space-y-10 p-6 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob blur-md"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-30 rounded-full translate-x-1/2 translate-y-1/2 animate-blob delay-2000 blur-md"></div>

        <div className="mb-8 animate-fade-in flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              Welcome Back,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <p className="text-md md:text-lg text-gray-600 mt-2">Your financial overview</p>
          </div>
          <button
            onClick={fetchCardData}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition duration-300"
          >
            <LuRefreshCw className="mr-2 w-5 h-5" /> Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-slide-up">
          <InfoCard
            icon={<IoMdCard className="text-3xl text-purple-600" />}
            label="Total Balance"
            value={`${addThousandsSeperator(totalBalance.toFixed(2))}`}
            className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500 cursor-pointer transform hover:-translate-y-2"
            valueStyle="text-2xl md:text-4xl font-bold text-purple-700"
            labelStyle="text-lg text-gray-600"
            onClick={() => navigate("/cards-dashboard/balance-overview")}
          />

          <InfoCard
            icon={<IoMdCard className="text-3xl text-green-600" />}
            label="Total Credit Limit"
            value={`${addThousandsSeperator(totalCreditLimit.toFixed(2))}`}
            className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500 cursor-pointer transform hover:-translate-y-2"
            valueStyle="text-2xl md:text-4xl font-bold text-green-700"
            labelStyle="text-lg text-gray-600"
            onClick={() => navigate("/cards-dashboard/credit-limit")}
          />

          <InfoCard
            icon={<LuHandCoins className="text-3xl text-red-600" />}
            label="Total Expense"
            value={`${addThousandsSeperator(Math.abs(totalExpense).toFixed(2))}`}
            className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-red-500 cursor-pointer transform hover:-translate-y-2"
            valueStyle="text-2xl md:text-4xl font-bold text-red-700"
            labelStyle="text-lg text-gray-600"
            onClick={() => navigate("/cards-dashboard/expense-breakdown")}
          />
        </div>

        <div className="mt-10 space-y-8 animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <RecentTransactions
              transactions={Object.values(cardData.transactions).flat() || []}
              onSeeMore={() => navigate("/cards-dashboard/transactions")}
              className="border-none"
            />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart for Expenses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <canvas ref={expenseChartRef} width="400" height="200"></canvas>
                <p className="text-center text-gray-600 mt-2">Expense Trend (Last 5 Days)</p>
              </div>
              {/* Pie Chart for Balance vs Credit Limit */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <canvas ref={balanceChartRef} width="400" height="200"></canvas>
                <p className="text-center text-gray-600 mt-2">Balance vs Credit Limit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CardsDashboard;