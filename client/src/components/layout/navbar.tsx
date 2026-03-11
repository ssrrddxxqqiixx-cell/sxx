import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, LogIn, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@assets/image_1773231247802.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; avatar: string; id: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDiscordLogin = () => {
    // Mock Discord Login
    setUser({
      username: "GamerPro99",
      avatar: "https://cdn.discordapp.com/embed/avatars/1.png",
      id: "123456789012345678"
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img src={logo} alt="UAA Store" className="h-12 drop-shadow-[0_0_10px_rgba(176,38,255,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all" />
              <span className="font-display font-bold text-xl tracking-wider neon-text-purple hidden sm:inline">
                𝐔𝐀𝐀 𝐒𝐓𝐎𝐑𝐄
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 font-semibold tracking-wide">
              <Link href="/"><span className="text-foreground/80 hover:text-white transition-colors cursor-pointer uppercase text-sm">Home</span></Link>
              <Link href="/"><span className="text-primary hover:text-white transition-colors cursor-pointer uppercase text-sm">Store</span></Link>
              <a href="https://discord.gg/tHUYCcmFwx" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-[#5865F2] transition-colors cursor-pointer uppercase text-sm">Discord</a>
              <a href="#" className="text-foreground/80 hover:text-white transition-colors cursor-pointer uppercase text-sm">Support</a>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://discord.gg/tHUYCcmFwx" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/20 hover:text-white transition-all uppercase font-bold tracking-wider">
                  Join Discord
                </Button>
              </a>
              
              {user ? (
                <div className="flex items-center gap-3 bg-card/50 border border-white/10 rounded-full pl-2 pr-4 py-1">
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-primary/50" />
                  <span className="font-bold text-sm">{user.username}</span>
                  <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive ml-2">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button onClick={handleDiscordLogin} className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold uppercase tracking-wider gap-2">
                  <LogIn className="w-4 h-4" />
                  Login with Discord
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
          <a href="https://discord.gg/tHUYCcmFwx" target="_blank" rel="noopener noreferrer" className="block p-2 text-white font-bold">Discord</a>
          <a href="#" className="block p-2 text-white font-bold">Support</a>
          
          <div className="h-px bg-white/10 my-2" />
          
          {user ? (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                <span className="font-bold">{user.username}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleDiscordLogin} className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold uppercase gap-2">
              <LogIn className="w-4 h-4" />
              Login with Discord
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
