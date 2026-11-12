import { useState } from "react";
import { demoClient, demoConsultant } from "../utils/demoData.js";

export function useAuth({ authMode, setAuthMode, setNotice, setSection }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("claro-user"));
    } catch {
      return null;
    }
  });

  const signIn = async (email, password, name, role) => {
    let account;
    try {
      const response = await fetch(`/api/auth/${authMode === "signup" ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      account = data.user;
    } catch (error) {
      if (authMode === "signup") account = { id: Date.now().toString(), name, email, role };
      else if (email === demoClient.email && password === "demo123") account = demoClient;
      else if (email === demoConsultant.email && password === "demo123") account = demoConsultant;
      else {
        setNotice(error.message?.includes("fetch") ? "Start the API for custom accounts, or use a demo account." : error.message);
        return;
      }
    }
    localStorage.setItem("claro-user", JSON.stringify(account));
    setUser(account);
    setNotice("");
    setSection("Overview");
  };

  const signOut = () => {
    localStorage.removeItem("claro-user");
    setUser(null);
    setAuthMode("login");
  };

  const updateProfile = (updates) => {
    const nextUser = { ...user, ...updates };
    localStorage.setItem("claro-user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  return { user, signIn, signOut, updateProfile };
}
