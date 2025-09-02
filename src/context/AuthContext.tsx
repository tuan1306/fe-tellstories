"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "Admin" | "Moderator";

type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  userType: "Admin" | "Moderator";
  phoneNumber?: string;
  dob?: string;
  status?: string;
};

type AuthContextType = {
  user: User | null;
  role: Role | null;
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
            userType: (u.userType as Role) ?? "Moderator",
            phoneNumber: u.phoneNumber,
            dob: u.dob,
            status: u.status,
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
    <AuthContext.Provider
      value={{ user, role: user?.userType ?? null, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
