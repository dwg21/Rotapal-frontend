import React, { createContext, useContext, useReducer, useEffect } from "react";
const RotaContext = createContext();
import ServerApi from "./serverApi/axios";

// Define the initial state
const initialState = {
  loggedIn: false,
  userData: null,
};

// Define the reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { loggedIn: true, userData: action.payload };
    case "LOGOUT":
      return { loggedIn: false, userData: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await ServerApi.get("/api/v1/users/showMe", {
          withCredentials: true,
        });
        if (response.data.user) {
          dispatch({ type: "LOGIN", payload: response.data.user });
        }
      } catch (error) {
        dispatch({ type: "LOGOUT" });
        console.error("User not authenticated", error);
      }
    };

    checkAuth();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <RotaContext.Provider value={{ state, dispatch }}>
      {children}
    </RotaContext.Provider>
  );
};

export const userContext = () => useContext(RotaContext);
