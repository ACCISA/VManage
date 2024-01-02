import { createContext, useState } from "react";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  return (
    <UserContext.Provider>
      {children}
    </UserContext.Provider>
  );
}