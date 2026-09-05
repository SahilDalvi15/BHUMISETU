import React, { createContext, useContext } from 'react';
import useAppStore from '../store/useAppStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const user = useAppStore((state) => state.activeUser);
  const setActiveUser = useAppStore((state) => state.setActiveUser);

  const login = async (userId) => {
    setActiveUser(userId);
    return { success: true };
  };

  const logout = () => {
    // In demo mode, we might just switch back to a default user or null
    // Let's keep it null for the login screen to show
    setActiveUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
