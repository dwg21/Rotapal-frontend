import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import ServerApi from "../serverApi/axios";

interface UserData {
  business: string;
  name: string;
  role: string;
  userId: string;
}

interface UserState {
  loggedIn: boolean;
  userData: UserData | null;
}

// inital store
const initialState: UserState = {
  loggedIn: false,
  userData: null,
};
type UserAction = { type: "LOGIN"; payload: UserData } | { type: "LOGOUT" };

// Reducer function
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "LOGIN":
      return { loggedIn: true, userData: action.payload };
    case "LOGOUT":
      localStorage.removeItem("selectedVenueID");
      return { loggedIn: false, userData: null };
    default:
      return state;
  }
};

interface UserContextProps {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// Provider component props
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
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

  const logout = async () => {
    try {
      await ServerApi.post("/api/v1/users/logout", { withCredentials: true });
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for accessing the context
export const userContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
