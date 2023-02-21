import React, { createContext, useState } from "react";

interface NavContextProps {
  navSize: string;
  setNavSize: (value: string) => void;
  selectedNavItem: string;
  setSelectedNavItem: (value: string) => void;
}

interface NavProviderProps {
  children: React.ReactNode;
}

export const NavProvider: React.FC<NavProviderProps> = ({ children }) => {
  const [navSize, setNavSize] = useState("large");
  const [selectedNavItem, setSelectedNavItem] = useState("/dashboard");

  return (
    <NavContext.Provider
      value={{ navSize, setNavSize, selectedNavItem, setSelectedNavItem }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const NavContext = createContext<NavContextProps | undefined>(undefined);
