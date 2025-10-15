import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useUserAuth must be used within a UserProvider");
  }

  const { user, updateUser, clearUser, accessToken, updateAccessToken } = context;

  useEffect(() => {
    // Only fetch if user is not already set
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (isMounted && response.data) {
          updateUser(response.data); // Update context with user data
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (isMounted) {
          clearUser(); // Call clearUser as a function
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [user]); // Only re-run if user changes

  return { user, updateUser, clearUser, accessToken, updateAccessToken }; // Return full context
};