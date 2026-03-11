export type UserRole = "admin" | "user" | null;

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

const STORAGE_KEYS = {
  USER_ROLE: "userRole",
  USER_TOKEN: "userToken",
  USERNAME: "adminUsername",
  USER_DATA: "userData",
};

export const authService = {
  // Admin login
  adminLogin: (username: string, password: string): boolean => {
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, "admin");
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, "mock-admin-token-" + Date.now());
      localStorage.setItem(STORAGE_KEYS.USERNAME, username);
      return true;
    }
    return false;
  },

  // Regular user login (mock Discord)
  userLogin: (): void => {
    const mockUser = {
      id: "user-" + Date.now(),
      username: "DiscordUser",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Discord",
    };
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, "user");
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, "mock-user-token-" + Date.now());
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
  },

  // Get current user role
  getUserRole: (): UserRole => {
    return (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole) || null;
  },

  // Get current user data
  getCurrentUser: (): User | null => {
    const role = authService.getUserRole();
    if (!role) return null;

    if (role === "admin") {
      const username = localStorage.getItem(STORAGE_KEYS.USERNAME) || "Admin";
      return {
        id: "admin",
        username,
        role: "admin",
      };
    }

    if (role === "user") {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const parsed = JSON.parse(userData);
        return {
          ...parsed,
          role: "user",
        };
      }
    }

    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const role = authService.getUserRole();
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    return !!role && !!token;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return authService.getUserRole() === "admin";
  },

  // Check if user is regular user
  isUser: (): boolean => {
    return authService.getUserRole() === "user";
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem("adminToken"); // Legacy support
  },
};
