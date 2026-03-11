import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, LogIn, LogOut, Menu, X, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { authService } from "@/lib/auth";
import { cartService } from "@/lib/cart";
import logo from "@assets/image_1773231247802.png";

export function Navbar() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; avatar: string; id: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check auth status
    if (authService.isAuthenticated() && authService.isUser()) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser({
          username: currentUser.username,
          avatar: currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
          id: currentUser.id
        });
      }
    }
    
    // Initialize cart count
    setCartCount(cartService.getItemCount());
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(cartService.getItemCount());
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleRegularUserLogin = () => {
    setLocation("/login");
    setLoginModalOpen(false);
  };

  const handleAdminLogin = () => {
    setLoginModalOpen(false);
    setLocation("/admin-login");
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setLocation("/");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img src={logo} alt="UAA Store" className="h-12 drop-shadow-[0_0_10px_rgba(128,128,128,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(160,160,160,0.4)] transition-all" />
              <span className="font-display font-bold text-xl tracking-wider neon-text-gray hidden sm:inline">
                𝐔𝐀𝐀 𝐒𝐓𝐎𝐑𝐄
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 font-semibold tracking-wide">
              <Link href="/"><span className="text-foreground/80 hover:text-white transition-colors cursor-pointer uppercase text-sm">Home</span></Link>
              <Link href="/"><span className="text-primary hover:text-white transition-colors cursor-pointer uppercase text-sm">Store</span></Link>
              <a href="https://discord.gg/tHUYCcmFwx" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-white transition-colors cursor-pointer uppercase text-sm">Support</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-background">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              <a href="https://discord.gg/tHUYCcmFwx" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/20 hover:text-white transition-all uppercase font-bold tracking-wider">
                  Join Discord
                </Button>
              </a>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/account">
                    <div className="flex items-center gap-3 bg-card/50 border border-white/10 rounded-full pl-2 pr-4 py-1 cursor-pointer hover:bg-white/5 transition-colors">
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-primary/50" />
                      <span className="font-bold text-sm text-white">{user.username}</span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="text-muted-foreground hover:text-gray-400 p-2" title="Log out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button onClick={() => setLocation("/login")} className="bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase tracking-wider gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="/"><span className="block p-2 text-white font-bold">Home</span></Link>
          <Link href="/"><span className="block p-2 text-primary font-bold">Store</span></Link>
          <a href="https://discord.gg/tHUYCcmFwx" target="_blank" rel="noopener noreferrer" className="block p-2 text-white font-bold">Support</a>
          
          <div className="h-px bg-white/10 my-2" />
          
          {user ? (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-3 mb-2">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                <span className="font-bold">{user.username}</span>
              </div>
              <Link href="/account">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5">
                  <User className="w-4 h-4 mr-2" />
                  My Account
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({cartCount})
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              <Link href="/cart">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({cartCount})
                </Button>
              </Link>
              <Button onClick={() => setLocation("/login")} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="bg-card border-gray-600/20 sm:max-w-md" data-testid="dialog-login-options">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wider">Choose Login Type</DialogTitle>
            <DialogDescription>
              Select how you'd like to log in to the store.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={handleRegularUserLogin}
              className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase tracking-wider gap-2 flex items-center justify-center"
              data-testid="button-login-user"
            >
              <LogIn className="w-5 h-5" />
              Login as User
            </Button>

            <Button
              onClick={handleAdminLogin}
              className="w-full h-12 bg-gray-600 hover:bg-gray-500 text-white font-bold uppercase tracking-wider gap-2 flex items-center justify-center"
              data-testid="button-login-admin"
            >
              <Shield className="w-5 h-5" />
              Admin Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
