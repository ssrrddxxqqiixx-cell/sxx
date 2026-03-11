import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LogIn } from "lucide-react";
import logo from "@assets/image_1773231247802.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store admin session in localStorage
      localStorage.setItem("adminToken", "mock-admin-token-" + Date.now());
      localStorage.setItem("adminUsername", username);
      setLocation("/admin/dashboard");
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gray-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="UAA Store" className="h-20 drop-shadow-[0_0_15px_rgba(128,128,128,0.4)]" />
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl border border-gray-600/20">
          <div className="flex items-center justify-center mb-8">
            <Lock className="w-8 h-8 text-gray-400 mr-3" />
            <h1 className="text-3xl font-display font-bold text-white tracking-wider">ADMIN LOGIN</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-card border-gray-600/30 text-white placeholder:text-gray-600 focus:border-gray-400"
                disabled={loading}
                data-testid="input-admin-username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-card border-gray-600/30 text-white placeholder:text-gray-600 focus:border-gray-400"
                disabled={loading}
                data-testid="input-admin-password"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium" data-testid="error-login">
                {error}
              </div>
            )}

            {/* Demo credentials */}
            <div className="p-4 rounded-lg bg-gray-600/10 border border-gray-600/20 text-gray-300 text-xs">
              <p className="font-semibold mb-2 text-gray-400">Demo Credentials:</p>
              <p>Username: <code className="text-gray-200 font-mono">admin</code></p>
              <p>Password: <code className="text-gray-200 font-mono">admin123</code></p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full h-12 bg-gray-600 hover:bg-gray-500 text-white font-display font-bold uppercase tracking-widest gap-2"
              data-testid="button-login-submit"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Protected admin panel - For store managers only
        </p>
      </div>
    </div>
  );
}
