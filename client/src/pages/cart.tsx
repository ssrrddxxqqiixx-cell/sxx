import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, ChevronLeft, CreditCard } from "lucide-react";
import { cartService } from "@/lib/cart";

export default function Cart() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState(cartService.getItems());
  
  // Update UI and storage
  const handleUpdateQuantity = (id: number, quantity: number) => {
    cartService.updateQuantity(id, quantity);
    setItems(cartService.getItems());
  };

  const handleRemove = (id: number) => {
    cartService.removeItem(id);
    setItems(cartService.getItems());
  };

  const total = cartService.getTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-500" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-wider mb-4">YOUR CART IS EMPTY</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Looks like you haven't added any packages to your cart yet. Browse our store to find the perfect addition for your roleplay experience.
        </p>
        <Link href="/">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white px-8 h-12 font-bold tracking-wider uppercase">
            Browse Store
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-4xl font-display font-black text-white tracking-wider uppercase">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-6">Package</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center shrink-0 border border-gray-700">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.category}</div>
                      <h3 className="font-bold text-white leading-tight">{item.name}</h3>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 md:text-center font-mono text-gray-300">
                    <span className="md:hidden text-xs text-gray-500 uppercase tracking-wider mr-2">Price:</span>
                    ${item.price.toFixed(2)}
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 flex items-center md:justify-center gap-3">
                    <span className="md:hidden text-xs text-gray-500 uppercase tracking-wider mr-2">Qty:</span>
                    <div className="flex items-center bg-gray-900 border border-gray-700 rounded-md">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-l-md"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-white font-mono text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-xl border border-white/10 sticky top-24">
            <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wider uppercase border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-mono text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxes</span>
                <span className="font-mono text-white">$0.00</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="font-bold text-white tracking-wider uppercase">Total</span>
                <span className="font-display font-bold text-2xl text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold tracking-widest uppercase text-lg gap-2">
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </Button>
            </Link>
            
            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" /> Secure checkout with Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Package, Shield } from "lucide-react";