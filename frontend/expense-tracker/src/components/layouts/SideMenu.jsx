import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 p-6 flex flex-col border-r border-gray-200">
      {/* Logo & App Name */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" alt="TrackMyCash Logo" className="w-10 h-10" />
        <h2 className="text-xl font-bold text-gray-900">TrackMyCash</h2>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full border-4 border-purple-500 shadow-md"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className="text-lg font-semibold text-gray-900 mt-3">
          {user?.fullName || "Welcome User"}
        </h5>
      </div>

      {/* Menu Items (Without Extra Logout Button) */}
      <div className="flex flex-col gap-2 flex-1">
        {SIDE_MENU_DATA
          .filter((item) => item.path !== "/logout") // Removes the duplicate logout button
          .map((item, index) => (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-md font-medium transition-all duration-200
                ${activeMenu === item.path
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"}`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="text-2xl transition-all duration-200" />
              <span>{item.label}</span>
            </button>
          ))}
      </div>

      <button
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-100 transition-all duration-200"
        onClick={handleLogout}
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default SideMenu;