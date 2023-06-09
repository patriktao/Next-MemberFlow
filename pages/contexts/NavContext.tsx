import React, { createContext, useState } from "react";

interface NavContextProps {
  selectedNavItem: string;
  setSelectedNavItem: (value: string) => void;
}

interface NavProviderProps {
  children: React.ReactNode;
}

export const NavProvider: React.FC<NavProviderProps> = ({ children }) => {
  const [selectedNavItem, setSelectedNavItem] = useState("/dashboard");

  return (
    <NavContext.Provider
      value={{ selectedNavItem, setSelectedNavItem }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const NavContext = createContext<NavContextProps | undefined>(undefined);
