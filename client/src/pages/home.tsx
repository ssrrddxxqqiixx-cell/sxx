import { useState } from "react";
import { packages, Package } from "@/lib/mock-data";
import { PackageCard } from "@/components/store/package-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, CreditCard } from "lucide-react";
import heroBg from "@assets/image_1773231699063.png";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const categories = ["All", ...Array.from(new Set(packages.map(p => p.category)))];

  const filteredPackages = activeCategory === "All" 
    ? packages 
    : packages.filter(p => p.category === activeCategory);

  const handleBuy = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsCheckingOut(true);
    setPurchaseSuccess(false);
  };

  const processMockPayment = () => {
    // Simulate Stripe payment processing & Webhook firing
    setTimeout(() => {
      setPurchaseSuccess(true);
      setTimeout(() => {
        setIsCheckingOut(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Cyberpunk City" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-widest uppercase neon-text-gray">
            With <span className="text-gray-400">UAA STORE</span>,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Live a Different Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium">
            Get exclusive packages, roles, and items for the ultimate roleplay session. Log in with Discord to claim your rewards instantly.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 font-display font-bold uppercase tracking-widest neon-box-gray">
            Browse Store
          </Button>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            {/* Category Filter */}
            <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 scrollbar-hide no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-display text-sm font-bold tracking-wider whitespace-nowrap transition-all ${
                    activeCategory === cat 
                      ? "bg-gray-600 text-white neon-box-gray" 
                      : "bg-card border border-white/10 text-muted-foreground hover:text-white hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} onBuy={handleBuy} />
            ))}
          </div>
        </div>
      </section>

      {/* Mock Checkout Dialog */}
      <Dialog open={isCheckingOut} onOpenChange={setIsCheckingOut}>
        <DialogContent className="bg-card border-gray-600/20 neon-box-gray sm:max-w-md">
          {purchaseSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <DialogTitle className="text-2xl font-display text-white mb-2">Payment Successful!</DialogTitle>
              <p className="text-muted-foreground">
                Your <span className="text-gray-400 font-bold">{selectedPackage?.name}</span> has been applied to your account.
              </p>
              <p className="text-xs text-muted-foreground mt-4 italic">
                A Discord webhook has been triggered.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display tracking-wider text-xl">Checkout</DialogTitle>
                <DialogDescription>
                  You are purchasing <span className="text-white font-bold">{selectedPackage?.name}</span> for your FiveM account.
                </DialogDescription>
              </DialogHeader>
              
              <div className="bg-background/50 p-4 rounded-lg border border-white/5 my-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{selectedPackage?.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedPackage?.category}</div>
                </div>
                <div className="font-display text-xl font-bold text-primary">
                  ${selectedPackage?.price.toFixed(2)}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckingOut(false)} className="border-white/10">
                  Cancel
                </Button>
                <Button onClick={processMockPayment} className="bg-[#635BFF] hover:bg-[#635BFF]/80 text-white gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pay with Stripe
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
