import { createContext, useContext, useEffect, useState } from "react";

export interface user {
  id?: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  user_profile_photo?: string | null;
  phoneNumber?: string | null;
  status?: number;
}
interface AuthContextType {
  user: user | null;
  isAuthenticated: boolean;
  setUser: (user: user | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<user | null>(null);

useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      setUser(null);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  } catch (error) {
    console.error("Invalid user in localStorage:", error);
    localStorage.removeItem("user"); // cleanup corrupted data
    setUser(null);
  }
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
