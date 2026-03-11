import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, User } from "lucide-react";
import { authService } from "@/lib/auth";
import logo from "@assets/image_1773231247802.png";

export default function Register() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Create new user through auth service
      const success = authService.registerUser(username, email, password);
      
      if (success) {
        // Auto-login after registration
        authService.userLoginWithCredentials(username, password);
        setLocation("/account");
      } else {
        setError("Username or email already exists");
        setLoading(false);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
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
              <UserPlus className="w-8 h-8 text-gray-300" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-wider">CREATE ACCOUNT</h1>
            <p className="text-gray-400 mt-2 text-center">Join UAA STORE to manage your purchases</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="bg-gray-950/50 border-gray-600/50 text-white placeholder:text-gray-600 h-12"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-950/50 border-gray-600/50 text-white placeholder:text-gray-600 h-12"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
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
              disabled={loading || !username || !email || !password}
              className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-white font-display font-bold uppercase tracking-widest mt-4"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-white hover:text-gray-300 font-bold cursor-pointer transition-colors">
                Log in
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}