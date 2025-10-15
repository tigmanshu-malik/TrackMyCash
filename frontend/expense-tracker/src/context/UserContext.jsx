import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    // Retrieve accessToken from localStorage on mount
    return localStorage.getItem('plaidAccessToken') || null;
  });

  // Function to update user data
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  // Function to update accessToken and persist it
  const updateAccessToken = (newAccessToken) => {
    setAccessToken(newAccessToken);
    localStorage.setItem('plaidAccessToken', newAccessToken);
  };

  // Function to clear user and accessToken data
  const clearUser = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('plaidAccessToken');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        accessToken,
        updateAccessToken,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;