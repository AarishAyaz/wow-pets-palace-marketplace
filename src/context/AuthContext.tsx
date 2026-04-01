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
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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
