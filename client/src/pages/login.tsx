import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, User } from "lucide-react";
import { authService } from "@/lib/auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    // Try normal user login first
    if (authService.userLoginWithCredentials(username, password)) {
      setLocation("/account");
      return;
    }
    
    // Try admin login if normal user fails
    if (authService.adminLogin(username, password)) {
      setLocation("/admin-dashboard");
      return;
    }

    setError("Invalid username or password");
    setLoading(false);
  };

  // Quick Discord mock login for testing without registering
  const handleDiscordLogin = () => {
    authService.userLogin();
    setLocation("/account");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent relative overflow-hidden py-20">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-panel p-8 rounded-2xl border border-gray-600/20">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-600/50">
              <User className="w-8 h-8 text-gray-300" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-wider">WELCOME BACK</h1>
            <p className="text-gray-400 mt-2 text-center">Log in to access your purchases and settings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-gray-950/50 border-gray-600/50 text-white placeholder:text-gray-600 h-12"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Forgot password?</a>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-950/50 border-gray-600/50 text-white placeholder:text-gray-600 h-12"
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-white font-display font-bold uppercase tracking-widest mt-2 gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging in..." : "Log In"}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-[#141414] px-2 text-gray-500 font-semibold">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleDiscordLogin}
              variant="outline"
              className="w-full h-12 border-gray-600 text-white hover:bg-[#5865F2]/20 hover:text-white hover:border-[#5865F2]/50 font-bold gap-2 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              Discord Login (Demo)
            </Button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-white hover:text-gray-300 font-bold cursor-pointer transition-colors">
                Register now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}