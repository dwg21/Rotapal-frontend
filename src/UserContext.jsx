import React, { createContext, useContext, useState } from "react";
const RotaContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "no one logged in" });

  return (
    <RotaContext.Provider value={{ user, setUser }}>
      {children}
    </RotaContext.Provider>
  );
};

export const userContext = () => useContext(RotaContext);
