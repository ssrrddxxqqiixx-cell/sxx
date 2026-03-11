import { Package } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import crateImg from "@/assets/images/package-crate.png";

interface PackageCardProps {
  pkg: Package;
  onBuy: (pkg: Package) => void;
}

export function PackageCard({ pkg, onBuy }: PackageCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden glass-panel border-white/10 hover:neon-border-gray transition-all duration-500 hover:-translate-y-2">
      {/* Glow effect behind card */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 rounded-xl" />
      
      <div className="relative h-full flex flex-col p-6 z-10 bg-card/90">
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-gray-500/20 blur-xl rounded-full" />
          <img 
            src={crateImg} 
            alt={pkg.name} 
            className="w-32 h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(128,128,128,0.5)] group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="mb-2">
          <span className="text-xs font-display tracking-widest text-gray-400 font-bold uppercase">
            {pkg.category}
          </span>
        </div>
        
        <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-1 group-hover:neon-text-gray transition-colors">
          {pkg.name}
        </h3>
        
        <p className="text-muted-foreground text-sm flex-grow mb-6 line-clamp-2">
          {pkg.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div className="font-display font-bold text-2xl text-gray-300">
            ${pkg.price.toFixed(2)}
          </div>
          <Button 
            onClick={() => onBuy(pkg)}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold tracking-wider uppercase"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
