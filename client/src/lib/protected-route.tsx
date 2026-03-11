import { useEffect } from "react";
import { useLocation } from "wouter";
import { authService, UserRole } from "./auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole = "user" }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.getUserRole();

    // Not authenticated, redirect to login
    if (!isAuthenticated) {
      setLocation("/admin-login");
      return;
    }

    // Check if user has required role
    if (requiredRole === "admin" && userRole !== "admin") {
      setLocation("/");
      return;
    }
  }, [setLocation, requiredRole]);

  return <>{children}</>;
}
