import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  degree?: string;
  yearOfPassing?: string;
  skills?: string[];
  CGPA?: number;
  Certifications?: any[];
  isVerified: boolean;
  status: string;
  role?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsLoggedIn(true);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    isLoggedIn,
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
