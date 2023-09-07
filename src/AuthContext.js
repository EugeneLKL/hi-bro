import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state with the value from local storage, if available
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [profileImageUrl, setProfileImageUrl] = useState(localStorage.getItem('profileImageUrl') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [rerender, setRerender] = useState(true);

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // setUserId(null);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userId,
      setUserId,
      userName,
      setUserName,
      profileImageUrl,
      setProfileImageUrl,
      handleLogin,
      handleLogout,
      rerender,
      setRerender
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
