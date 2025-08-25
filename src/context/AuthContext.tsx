"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: "Admin" | "Moderator";
};

type AuthContextType = {
  user: User | null;
  role: "Admin" | "Moderator" | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Get the user info and then put it in AuthContext
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          const u = data.data;
          setUser({
            id: u.id,
            email: u.email,
            displayName: u.displayName,
            avatarUrl: u.avatarUrl,
            role: u.userType,
          });
        }
      })
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
