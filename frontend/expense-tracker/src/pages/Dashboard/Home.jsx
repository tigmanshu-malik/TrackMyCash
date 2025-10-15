import React, { useEffect, useState } from "react";
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
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import Last30DaysExpenses from "../../components/Dashboard/last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

const Home = () => {
  const { user, updateUser } = useUserAuth(); // Destructure updateUser for potential manual updates
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      console.log("Dashboard Data:", response.data); // Debug full response
      // Check if fullName is present, otherwise rely on user context
      const fullName = response.data.fullName || (user && (user.fullName || user.name));
      if (fullName && !user) {
        updateUser({ fullName, name: fullName }); // Update context if user is null
      }
      setDashboardData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load dashboard data");
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="text-center py-8 text-gray-600 animate-pulse">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="text-red-500 text-center py-8">
          {error || "No data available"}
          <button
            onClick={fetchDashboardData}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <LuRefreshCw className="inline w-5 h-5" /> Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Debug user and dashboardData
  console.log("User Object:", user);
  console.log("Dashboard Data:", dashboardData);

  const displayName = dashboardData.fullName || user?.fullName || user?.name || "User";

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="space-y-8 p-4 md:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 opacity-20 rounded-full translate-x-1/2 translate-y-1/2 animate-blob delay-2000"></div>

        <div className="mb-6 animate-fade-in flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
              Welcome Back,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's your financial overview</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <LuRefreshCw className="w-4 h-4 mr-1" /> Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-slide-up">
          <InfoCard
            icon={<IoMdCard className="text-2xl text-purple-600" />}
            label="Total Balance"
            value={`${addThousandsSeperator(dashboardData.totalBalance || 0)}`}
            className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border border-purple-100 cursor-pointer"
            valueStyle="text-2xl md:text-3xl font-bold text-purple-700"
            labelStyle="text-gray-600"
            onClick={() => navigate("/balance-overview")}
          />

          <InfoCard
            icon={<LuWalletMinimal className="text-2xl text-green-600" />}
            label="Total Income"
            value={`${addThousandsSeperator(dashboardData.totalIncome || 0)}`}
            className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border border-green-100 cursor-pointer"
            valueStyle="text-2xl md:text-3xl font-bold text-green-700"
            labelStyle="text-gray-600"
            onClick={() => navigate("/income-details")}
          />

          <InfoCard
            icon={<LuHandCoins className="text-2xl text-red-600" />}
            label="Total Expense"
            value={`${addThousandsSeperator(dashboardData.totalExpense || 0)}`}
            className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl border border-red-100 cursor-pointer"
            valueStyle="text-2xl md:text-3xl font-bold text-red-700"
            labelStyle="text-gray-600"
            onClick={() => navigate("/expense-breakdown")}
          />
        </div>

        <div className="mt-8 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <RecentTransactions
                transactions={dashboardData.recentTransactions || []}
                onSeeMore={() => navigate("/expenses")}
                className="border-none"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <FinanceOverview
                totalBalance={dashboardData.totalBalance || 0}
                totalIncome={dashboardData.totalIncome || 0}
                totalExpense={dashboardData.totalExpense || 0}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <Last30DaysExpenses
              data={dashboardData.last30DaysExpenses?.transactions || []}
              className="border-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <RecentIncomeWithChart
                data={dashboardData.last60DaysIncome?.transactions?.slice(0, 4) || []}
                totalIncome={dashboardData.totalIncome || 0}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <RecentIncome
                transactions={dashboardData.last60DaysIncome?.transactions || []}
                onSeeMore={() => navigate("/income")}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;