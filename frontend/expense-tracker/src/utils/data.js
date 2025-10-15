import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuCreditCard,
  LuLogOut,
  LuFileUp,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
      id: "01",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/dashboard",
  },
  {
      id: "02",
      label: "Income",
      icon: LuWalletMinimal,
      path: "/income",
  },
  {
      id: "03",
      label: "Expense",
      icon: LuHandCoins,
      path: "/expense",
  },
  {
      id: "04",
      label: "Cards",
      icon: LuCreditCard,
      path: "/cards-dashboard", // Updated to point to CardsDashboard
  },
  {
      id: "06",
      label: "Logout",
      icon: LuLogOut,
      path: "/logout",
  },
];