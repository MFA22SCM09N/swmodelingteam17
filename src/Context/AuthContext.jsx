/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// provider component
export function AuthProvider({ children }) {
  // Initialize isAuthenticated state with the value from localStorage, default to false if not found
  let initial;
  try {
    initial = JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  } catch (error) {
    console.error("Error retrieving isAuthenticated from localStorage:", error);
    initial = false;
  }
  const [isAuthenticated, setAuthenticated] = useState(initial);

  // Save isAuthenticated state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    } catch (error) {
      console.error("Error setting isAuthenticated to localStorage:", error);
    }
  }, [isAuthenticated]);

  return (
    //  Wrap application with the provider
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  // Use the useContext hook to access the AuthContext
  const context = useContext(AuthContext);

  // Throw an error if the hook is used outside of the AuthProvider
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  else return context;
};
