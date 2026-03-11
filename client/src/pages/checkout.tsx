import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle2, ChevronLeft, Lock } from "lucide-react";
import { cartService } from "@/lib/cart";
import { authService } from "@/lib/auth";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState(cartService.getItems());
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const total = cartService.getTotal();

  useEffect(() => {
    // Make sure user is logged in
    if (!authService.isAuthenticated()) {
      // Allow guest checkout or redirect to login? We'll redirect to login for this requirement
      setLocation("/login");
      return;
    }

    if (items.length === 0 && !success) {
      setLocation("/");
    }
  }, [items, success, setLocation]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      cartService.clearCart();
      setIsProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="glass-panel p-10 rounded-2xl border border-gray-600/30 max-w-md w-full text-center relative overflow-hidden">
          {/* Success glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/20 blur-[50px] -z-10" />
          
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-white tracking-wider mb-2">PAYMENT SUCCESSFUL</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase! Your packages have been applied to your FiveM account.
          </p>
          
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5 mb-8 text-left text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono text-gray-300">#{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-mono text-white font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800 text-white">
                Back to Store
              </Button>
            </Link>
            <Link href="/account" className="flex-1">
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold">
                View Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-4xl font-display font-black text-white tracking-wider uppercase">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/10">
              <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wider uppercase flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono text-gray-300">1</div>
                Payment Information
              </h3>
              
              <div className="space-y-6">
                {/* Mock Card Input */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-blue-500/20 rounded border border-blue-500/50"></div>
                      <div className="w-8 h-5 bg-red-500/20 rounded border border-red-500/50"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input 
                        placeholder="0000 0000 0000 0000" 
                        className="pl-10 bg-gray-950/50 border-gray-600/50 text-white font-mono h-12 text-lg tracking-widest"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiry Date</label>
                      <Input placeholder="MM/YY" className="bg-gray-950/50 border-gray-600/50 text-white font-mono h-12" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CVC</label>
                      <Input placeholder="123" className="bg-gray-950/50 border-gray-600/50 text-white font-mono h-12" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name on Card</label>
                  <Input placeholder="John Doe" className="bg-gray-950/50 border-gray-600/50 text-white h-12" required />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/10">
               <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wider uppercase flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono text-gray-300">2</div>
                FiveM Details
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In-Game ID / CFX</label>
                <Input placeholder="e.g. 12345" className="bg-gray-950/50 border-gray-600/50 text-white h-12" required />
                <p className="text-xs text-gray-500 mt-1">This is required to apply the packages to your account instantly.</p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="w-full h-16 text-lg bg-[#635BFF] hover:bg-[#635BFF]/80 text-white font-display font-bold tracking-widest uppercase gap-3 shadow-[0_0_20px_rgba(99,91,255,0.3)] transition-all"
            >
              {isProcessing ? (
                "Processing Payment..."
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ${total.toFixed(2)} Securely
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-xl border border-white/10 sticky top-24 bg-gray-900/50">
            <h3 className="text-lg font-display font-bold text-white mb-4 tracking-wider uppercase border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="max-h-64 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono text-sm text-gray-300">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span className="font-mono text-gray-300">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Processing Fee</span>
                <span className="font-mono text-gray-300">$0.00</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="font-bold text-white tracking-wider uppercase">Total</span>
                <span className="font-display font-bold text-2xl text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-xs text-gray-400">
              By confirming your purchase, you agree to our Terms of Service and understand that digital goods are non-refundable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}