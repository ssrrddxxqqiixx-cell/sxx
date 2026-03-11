import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Plus, Trash2, Edit2 } from "lucide-react";
import { packages as initialPackages, Package } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { authService } from "@/lib/auth";
import logo from "@assets/image_1773231247802.png";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
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
  }, [setLocation]);

  const handleLogout = () => {
    authService.logout();
    setLocation("/admin-login");
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage({ ...pkg });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (!editingPackage) return;
    
    const index = packages.findIndex(p => p.id === editingPackage.id);
    if (index >= 0) {
      const newPackages = [...packages];
      newPackages[index] = editingPackage;
      setPackages(newPackages);
    }
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleAddNew = () => {
    const newId = Math.max(...packages.map(p => p.id), 0) + 1;
    setEditingPackage({
      id: newId,
      name: "New Package",
      price: 0,
      category: "Misc",
      description: "New package description",
    });
    setIsModalOpen(true);
  };

  const handleSaveNew = () => {
    if (!editingPackage) return;
    
    const exists = packages.find(p => p.id === editingPackage.id);
    if (!exists) {
      setPackages([...packages, editingPackage]);
    } else {
      handleSave();
      return;
    }
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-600/20 bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="UAA Store" className="h-10" />
            <h1 className="text-2xl font-display font-bold text-white tracking-wider">ADMIN PANEL</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 font-medium">Welcome, <span className="text-gray-400 font-bold">{adminUsername}</span></span>
            <Button onClick={handleLogout} variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-600/20 gap-2" data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-white tracking-wider">Package Management</h2>
          <Button onClick={handleAddNew} className="bg-gray-700 hover:bg-gray-600 text-white font-bold gap-2 uppercase tracking-wider" data-testid="button-add-package">
            <Plus className="w-5 h-5" />
            Add Package
          </Button>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-xl overflow-hidden border border-gray-600/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600/20 bg-gray-900/50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-gray-600/10 hover:bg-gray-600/5 transition-colors" data-testid={`row-package-${pkg.id}`}>
                    <td className="px-6 py-4 text-sm text-gray-400">{pkg.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{pkg.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{pkg.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-300">${pkg.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 line-clamp-2">{pkg.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleEdit(pkg)}
                          size="icon"
                          variant="outline"
                          className="border-gray-600/50 text-gray-400 hover:bg-gray-600/20"
                          data-testid={`button-edit-package-${pkg.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(pkg.id)}
                          size="icon"
                          variant="outline"
                          className="border-gray-700/50 text-gray-500 hover:bg-gray-700/20"
                          data-testid={`button-delete-package-${pkg.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          Total Packages: <span className="font-bold text-gray-400">{packages.length}</span>
        </p>
      </div>

      {/* Edit Modal */}
      {editingPackage && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-card border-gray-600/20 sm:max-w-md" data-testid="dialog-edit-package">
            <DialogHeader>
              <DialogTitle className="font-display text-xl tracking-wider">
                {packages.some(p => p.id === editingPackage.id) ? "Edit Package" : "Add New Package"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">Name</label>
                <Input
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                  className="bg-gray-950 border-gray-600/50 text-white focus:border-gray-500"
                  data-testid="input-package-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">Category</label>
                  <Input
                    value={editingPackage.category}
                    onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                    className="bg-gray-950 border-gray-600/50 text-white focus:border-gray-500"
                    data-testid="input-package-category"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">Price ($)</label>
                  <Input
                    type="number"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) })}
                    className="bg-gray-950 border-gray-600/50 text-white focus:border-gray-500"
                    data-testid="input-package-price"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">Description</label>
                <Input
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="bg-gray-950 border-gray-600/50 text-white focus:border-gray-500"
                  data-testid="input-package-description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gray-600/50 text-gray-300 hover:bg-gray-600/20"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (packages.some(p => p.id === editingPackage.id)) {
                    handleSave();
                  } else {
                    handleSaveNew();
                  }
                }}
                className="bg-gray-700 hover:bg-gray-600"
                data-testid="button-save-package"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
