"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  ReactNode,
  Dispatch,
} from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import UserReducer from "./UserReducer";

// --- user type ---
export type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
} | null;

// --- action types ---
type ActionType =
  | { type: "SET_USER"; payload: UserType }
  | { type: "CLEAR_USER" };

// --- state and context types ---
type StateType = {
  user: UserType;
};

type ContextType = {
  user: UserType;
  dispatch: Dispatch<ActionType>; // Action types are now properly typed
};

const INITIAL_STATE: StateType = {
  user: null,
};

// --- create context ---
export const UserContext = createContext<ContextType>({
  user: null,
  dispatch: () => {},
});

// --- provider ---
export function UserContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      dispatch({
        type: "SET_USER",
        payload: {
          id: clerkUser.id,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          image: clerkUser.imageUrl,
        },
      });
    } else {
      dispatch({ type: "CLEAR_USER" });
    }
  }, [clerkUser]);

  return (
    <UserContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
