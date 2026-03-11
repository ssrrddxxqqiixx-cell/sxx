import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Users, Plus, Trash2, Edit2, LayoutDashboard, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { authService } from "@/lib/auth";
import logo from "@assets/image_1773231247802.png";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const STORAGE_KEY = "admin_managed_users";

const getInitialUsers = (): UserData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  
  // Default mock data
  const defaultUsers = [
    { id: "1", username: "admin", email: "admin@uaastore.com", role: "admin", createdAt: new Date().toISOString() },
    { id: "2", username: "discord_user_1", email: "user1@example.com", role: "user", createdAt: new Date().toISOString() },
    { id: "3", username: "player_99", email: "player99@example.com", role: "user", createdAt: new Date().toISOString() },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export default function AdminUsersDashboard() {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    if (!authService.isAdmin()) {
      setLocation("/admin-login");
      return;
    }
    const user = authService.getCurrentUser();
    if (user) {
      setAdminUsername(user.username);
    }
    setUsers(getInitialUsers());
  }, [setLocation]);

  const saveUsers = (newUsers: UserData[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
  };

  const handleLogout = () => {
    authService.logout();
    setLocation("/admin-login");
  };

  const handleEdit = (user: UserData) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    saveUsers(users.filter(u => u.id !== id));
  };

  const handleSave = () => {
    if (!editingUser) return;
    
    // Validate
    if (!editingUser.username || !editingUser.email) return;

    const index = users.findIndex(u => u.id === editingUser.id);
    if (index >= 0) {
      // Update
      const newUsers = [...users];
      newUsers[index] = editingUser;
      saveUsers(newUsers);
    } else {
      // Add
      const newUser = {
        ...editingUser,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      saveUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleAddNew = () => {
    setEditingUser({
      id: "",
      username: "",
      email: "",
      role: "user",
      createdAt: ""
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <img src={logo} alt="Logo" className="h-8 mb-4" />
          <h2 className="text-xl font-display font-bold text-white tracking-wider">ADMIN PANEL</h2>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          <Link href="/admin/control-panel">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-semibold">Control Panel</span>
            </a>
          </Link>
          
          <Link href="/admin/dashboard">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <Package className="w-5 h-5" />
              <span className="font-semibold">Packages</span>
            </a>
          </Link>

          <Link href="/admin-dashboard">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary border border-primary/20 transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Users</span>
            </a>
          </Link>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="mb-4 px-4">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="font-bold text-white truncate">{adminUsername}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-background via-background to-gray-900">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-card">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8" />
            <h1 className="font-display font-bold text-white tracking-wider">USERS</h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="text-muted-foreground">
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-display font-bold text-white tracking-wider mb-2">User Management</h1>
                <p className="text-muted-foreground">Add, edit, or remove users from the system.</p>
              </div>
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/80 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add New User
              </Button>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Username</th>
                      <th className="p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Email</th>
                      <th className="p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Role</th>
                      <th className="p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Created</th>
                      <th className="p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            {user.username}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            user.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-gray-800 text-gray-300 border border-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="text-gray-400 hover:text-white hover:bg-white/10">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit/Add User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-gray-600/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wider text-white">
              {editingUser?.id ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser?.id ? 'Modify user details below.' : 'Create a new user account.'}
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Username</label>
                <Input 
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  className="bg-background/50 border-white/10 focus:border-primary text-white"
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                <Input 
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="bg-background/50 border-white/10 focus:border-primary text-white"
                  placeholder="user@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-md h-10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/10 text-white">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/80 text-primary-foreground">
              Save User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}