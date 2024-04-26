
import { createContext, useState, useEffect, useContext } from "react";

const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
 
  let storedAccounts = [];
  let storedCurrAcc = null;

  try {
    storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    storedCurrAcc = JSON.parse(localStorage.getItem("currAcc")) || null;
  } catch (error) {
    console.error("Error parsing stored accounts:", error);
    
    storedAccounts = [];
    storedCurrAcc = null;
  }

  
  const [accounts, setAccounts] = useState(storedAccounts);
  const [currAcc, setCurrAcc] = useState(storedCurrAcc);

  
  useEffect(() => {
    try {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    } catch (error) {
      console.error("Error saving accounts to local storage:", error);
     
    }
  }, [accounts]);

 
  useEffect(() => {
    try {
      localStorage.setItem("currAcc", JSON.stringify(currAcc));
    } catch (error) {
      console.error("Error saving currAcc to local storage:", error);
      // Handle the error,
    }
  }, [currAcc]);

  return (
    // Wrap your application with the provider
    <AccountsContext.Provider
      value={{ accounts, setAccounts, currAcc, setCurrAcc }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

// Create a custom hook to use the context

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  // Throw an error if the hook is used outside of the AccountsProvider
  if (context === undefined)
    throw new Error("useAccounts must be used within an AccountsProvider");
  else return context;
};
