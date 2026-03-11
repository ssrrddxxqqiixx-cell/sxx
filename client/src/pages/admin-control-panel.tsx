import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Settings, Users, BarChart3 } from "lucide-react";
import { authService } from "@/lib/auth";
import logo from "@assets/image_1773231247802.png";

export default function AdminControlPanel() {
  const [, setLocation] = useLocation();
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    if (!authService.isAdmin()) {
      setLocation("/admin/login");
      return;
    }
    const user = authService.getCurrentUser();
    if (user) {
      setAdminUsername(user.username);
    }
  }, [setLocation]);

  const handleLogout = () => {
    authService.logout();
    setLocation("/admin/login");
  };

  const controlPanelSections = [
    {
      id: "packages",
      title: "Package Management",
      description: "Manage all in-game packages, pricing, and availability",
      icon: Package,
      action: () => setLocation("/admin/dashboard"),
      color: "bg-gray-700 hover:bg-gray-600",
    },
    {
      id: "settings",
      title: "Store Settings",
      description: "Configure store name, description, and general settings",
      icon: Settings,
      action: () => alert("Store settings coming soon"),
      color: "bg-gray-600 hover:bg-gray-500",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View sales, revenue, and user engagement metrics",
      icon: BarChart3,
      action: () => alert("Analytics dashboard coming soon"),
      color: "bg-gray-600 hover:bg-gray-500",
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage users, roles, and access permissions",
      icon: Users,
      action: () => alert("User management coming soon"),
      color: "bg-gray-600 hover:bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-600/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="UAA Store" className="h-10" />
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-wider">CONTROL PANEL</h1>
              <p className="text-sm text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Logged in as</p>
              <p className="font-bold text-white">{adminUsername}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-600/20 gap-2" data-testid="button-logout-cp">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-white tracking-wider mb-2">Welcome Back</h2>
          <p className="text-gray-400">Select a section below to manage different aspects of your store</p>
        </div>

        {/* Control Panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {controlPanelSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={section.action}
                className="glass-panel rounded-xl p-8 border border-gray-600/20 hover:border-gray-600/40 transition-all hover:-translate-y-1 text-left group"
                data-testid={`button-section-${section.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${section.color} p-4 rounded-lg transition-all`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {section.description}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-600/10">
                  <span className="text-gray-400 text-sm font-semibold group-hover:text-gray-300">Access Section →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel rounded-lg p-6 border border-gray-600/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">TOTAL PACKAGES</p>
            <p className="text-4xl font-display font-bold text-white">42</p>
          </div>
          <div className="glass-panel rounded-lg p-6 border border-gray-600/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">ACTIVE CATEGORIES</p>
            <p className="text-4xl font-display font-bold text-white">8</p>
          </div>
          <div className="glass-panel rounded-lg p-6 border border-gray-600/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">TOTAL REVENUE</p>
            <p className="text-4xl font-display font-bold text-white">$4.2K</p>
          </div>
          <div className="glass-panel rounded-lg p-6 border border-gray-600/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">ACTIVE USERS</p>
            <p className="text-4xl font-display font-bold text-white">328</p>
          </div>
        </div>
      </div>
    </div>
  );
}
