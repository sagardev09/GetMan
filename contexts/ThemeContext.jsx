'use client';

import { createContext, useContext } from 'react';

const RetroContext = createContext();

export const useRetro = () => {
  const context = useContext(RetroContext);
  if (!context) {
    return { isRetro: true }; // Default to retro style
  }
  return context;
};

export const RetroProvider = ({ children }) => {
  const value = {
    isRetro: true,
    retroStyle: 'classic'
  };

  return (
    <RetroContext.Provider value={value}>
      {children}
    </RetroContext.Provider>
  );
};