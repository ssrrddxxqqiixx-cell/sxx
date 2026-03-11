import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Clock, Package, LogOut, Settings, CreditCard } from "lucide-react";
import { authService, User as UserType } from "@/lib/auth";

export default function Account() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Make sure user is logged in
    if (!authService.isAuthenticated() || authService.isAdmin()) {
      setLocation("/login");
      return;
    }
    
    setUser(authService.getCurrentUser());
  }, [setLocation]);

  const handleLogout = () => {
    authService.logout();
    setLocation("/");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-black text-white tracking-wider uppercase">My Account</h1>
        <p className="text-muted-foreground mt-2">Manage your UAA STORE profile and view purchases</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 text-center border-b border-white/10 bg-white/[0.02]">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center mb-4 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{user.username}</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-800 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-700">
                Customer
              </span>
            </div>
            
            <nav className="p-2 flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <User className="w-4 h-4" />
                Overview
              </button>
              <button 
                onClick={() => setActiveTab("purchases")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'purchases' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Package className="w-4 h-4" />
                Purchase History
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </button>
            </nav>
            
            <div className="p-4 border-t border-white/10 mt-2">
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="w-full text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/10">
                <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wider uppercase border-b border-white/10 pb-4">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Username</p>
                    <p className="text-lg font-medium text-white bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {user.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                    <p className="text-lg font-medium text-white bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {user.email || "No email provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Account Status</p>
                    <p className="text-lg font-medium text-white bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      Active
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Member Since</p>
                    <p className="text-lg font-medium text-white bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <Package className="w-10 h-10 text-gray-400 mb-3" />
                  <h4 className="text-lg font-bold text-white mb-1">Recent Purchases</h4>
                  <p className="text-sm text-gray-400 mb-4">View your past transactions and active packages</p>
                  <Button variant="outline" className="border-gray-600 text-white mt-auto" onClick={() => setActiveTab("purchases")}>
                    View History
                  </Button>
                </div>
                
                <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <CreditCard className="w-10 h-10 text-gray-400 mb-3" />
                  <h4 className="text-lg font-bold text-white mb-1">Payment Methods</h4>
                  <p className="text-sm text-gray-400 mb-4">Manage your saved payment options</p>
                  <Button variant="outline" className="border-gray-600 text-white mt-auto" onClick={() => setActiveTab("settings")}>
                    Manage Billing
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "purchases" && (
            <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/10">
              <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wider uppercase border-b border-white/10 pb-4">Purchase History</h3>
              
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">No purchases yet</h4>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">When you buy packages from the store, they will appear here with their transaction details and activation status.</p>
                <Link href="/">
                  <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                    Browse Store
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/10">
              <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wider uppercase border-b border-white/10 pb-4">Account Settings</h3>
              
              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Display Name</label>
                  <Input defaultValue={user.username} className="bg-gray-900 border-gray-700" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Email Address</label>
                  <Input defaultValue={user.email || ""} type="email" className="bg-gray-900 border-gray-700" />
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-lg font-bold text-white mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">Current Password</label>
                      <Input type="password" placeholder="••••••••" className="bg-gray-900 border-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">New Password</label>
                      <Input type="password" placeholder="••••••••" className="bg-gray-900 border-gray-700" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Button className="bg-gray-700 hover:bg-gray-600">Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}