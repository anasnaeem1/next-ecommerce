"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
  useState,
  useCallback,
} from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import UserReducer from "./UserReducer";
import { ensureSessionOnLogin, getUserBySessionId } from "@/serverActions/user";
import { User, UserType, NotificationType } from "@/types";

// Re-export types for backward compatibility
export type { User, UserType, NotificationType };

export type NewProductType = {
  productTitle: string;
  productDesc: string;
  images: Array<string>;
  category: string;
  price: number;
  offerPrice: number;
} | null;

export type ActionType =
  | { type: "SET_USER"; payload: UserType }
  | { type: "CLEAR_USER" }
  | { type: "SET_NEW_PRODUCT"; payload: NewProductType }
  | { type: "SET_NOTIFICATION"; payload: NotificationType }
  | { type: "CLEAR_NOTIFICATION" };

type ContextType = {
  user: UserType;
  userLoaded: boolean;
  newProduct: NewProductType;
  notification: NotificationType;
  dispatch: Dispatch<ActionType>;
};

type StateType = {
  user: UserType;
  newProduct: NewProductType;
  notification: NotificationType;
};

// --- helpers ---
function getSessionIdFromStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const sessionId = sessionStorage.getItem("sessionId");
    return sessionId;
  } catch (error) {
    console.error("Error reading from sessionStorage:", error);
    return null;
  }
}

function saveSessionIdToStorage(sessionId: string) {
  if (typeof window === "undefined") {
    return;
  }
  
  try {
    if (!sessionId) {
      return;
    }
    
    sessionStorage.setItem("sessionId", sessionId);
  } catch (error) {
    console.error("Error saving to sessionStorage:", error);
  }
}

function removeSessionIdFromStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("sessionId");
}

// --- context ---
export const UserContext = createContext<ContextType>({
  user: null,
  userLoaded: false,
  newProduct: null,
  notification: null,
  dispatch: () => {},
});

const INITIAL_STATE: StateType = {
  user: null, // Don't load user from storage, only from Clerk
  newProduct: null,
  notification: null,
};

// --- provider ---
export function UserContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [userLoaded, setUserLoaded] = useState(false);

  // Helper function to create a new session and save it to sessionStorage
  const createNewSession = useCallback((clerkUserID: string) => {
    // Ensure session exists in database on login and save sessionId to sessionStorage
    ensureSessionOnLogin(clerkUserID)
      .then((result) => {
        if (result.success && result.sessionId) {
          // Convert sessionId to string (handle both ObjectId and string)
          const sessionIdStr = String(result.sessionId);
          
          // Save sessionId to sessionStorage
          saveSessionIdToStorage(sessionIdStr);

          // Get user from database using sessionId
          return getUserBySessionId(sessionIdStr);
        }
        return null;
      })
      .then((userResult) => {
        if (userResult && userResult.success && userResult.user) {
          // Re-save sessionId to ensure it persists
          const sessionId = getSessionIdFromStorage();
          if (sessionId) {
            saveSessionIdToStorage(sessionId);
          }
          
          // Set user in context from database
          dispatch({
            type: "SET_USER",
            payload: {
              id: userResult.user._id,
              name: userResult.user.name,
              email: userResult.user.email,
              image: userResult.user.imageUrl,
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error ensuring session on login:", error);
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const testKey = "__sessionStorage_test__";
      sessionStorage.setItem(testKey, "test");
      sessionStorage.removeItem(testKey);
    } catch (error) {
      console.error("sessionStorage is not available:", error);
    }
  }, []);

  // Get sessionId from sessionStorage and load user on every load
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionId = getSessionIdFromStorage();
    
    if (sessionId) {
      // Get user by sessionId
      getUserBySessionId(sessionId)
        .then((result) => {
          if (result.success && result.user) {
            // Re-save sessionId to ensure it persists (in case it was cleared)
            saveSessionIdToStorage(sessionId);
            
            // Set user in context from database
            dispatch({
              type: "SET_USER",
              payload: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                image: result.user.imageUrl,
              },
            });
          } else {
            // Session expired or invalid, remove it
            removeSessionIdFromStorage();
          }
        })
        .catch((error) => {
          console.error("Error getting user by session ID:", error);
          removeSessionIdFromStorage();
        });
    }
  }, []); // Run once on mount

  // Sync with Clerk and ensure session on login
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (clerkUser) {
      const clerkUserID = clerkUser.id;

      // Check if we already have a sessionId in sessionStorage
      const existingSessionId = getSessionIdFromStorage();
      
      // If we have a sessionId, validate it first before creating a new one
      if (existingSessionId) {
        getUserBySessionId(existingSessionId)
          .then((result) => {
            if (result.success && result.user) {
              // Session is valid, re-save it to ensure it persists
              saveSessionIdToStorage(existingSessionId);
              
              // Set user in context from database
              dispatch({
                type: "SET_USER",
                payload: {
                  id: result.user._id,
                  name: result.user.name,
                  email: result.user.email,
                  image: result.user.imageUrl,
                },
              });
            } else {
              // Session invalid, create a new one
              createNewSession(clerkUserID);
            }
          })
          .catch((error) => {
            // Error validating, create a new one
            console.error("Error validating existing session:", error);
            createNewSession(clerkUserID);
          });
      } else {
        // No existing session, create a new one
        createNewSession(clerkUserID);
      }
    } else {
      dispatch({ type: "CLEAR_USER" });
      // Remove session when user logs out
      removeSessionIdFromStorage();
    }

    setUserLoaded(true);
  }, [clerkUser, isLoaded, createNewSession]);

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        userLoaded,
        newProduct: state.newProduct,
        notification: state.notification,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
