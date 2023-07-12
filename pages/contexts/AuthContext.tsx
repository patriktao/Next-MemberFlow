import { getAuth } from "firebase/auth";
import React, { createContext, useCallback, useEffect, useState } from "react";

interface AuthContextProps {
  authUser: string;
  setAuthUser: (value: string) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState("");

  useEffect(() => {
    console.log(localStorage.getItem("authToken"));
    console.log(getAuth().currentUser);
    if (localStorage.getItem("authToken") !== null) {
      const email = getAuth().currentUser.email;
      setAuthUser(email);
    }
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);
