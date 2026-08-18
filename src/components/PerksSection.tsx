import React from 'react';
import { Heart, ShieldCheck, Lock, RotateCcw } from 'lucide-react';

export const PerksSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-[#F7E1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-sans font-bold text-sm sm:text-base tracking-[0.18em] text-[#2C2329] uppercase">
            WHY SHOP WITH US?
          </h2>
        </div>

        {/* 4 Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Handmade with Love */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FFF5F8] transition-colors">
            <div className="w-12 h-12 rounded-full border border-[#F5B8CE] bg-[#FFF0F5] flex items-center justify-center text-[#C4436A] shrink-0 shadow-xs">
              <Heart className="w-5 h-5 fill-[#FDE8EE]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#2C2329]">
                Handmade with Love
              </h4>
              <p className="text-xs text-[#8A737F]">
                Every piece is unique
              </p>
            </div>
          </div>

          {/* 2. Premium Quality */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FFF5F8] transition-colors">
            <div className="w-12 h-12 rounded-full border border-[#F5B8CE] bg-[#FFF0F5] flex items-center justify-center text-[#C4436A] shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#2C2329]">
                Premium Quality
              </h4>
              <p className="text-xs text-[#8A737F]">
                Only the best for you
              </p>
            </div>
          </div>

          {/* 3. Secure Payments */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FFF5F8] transition-colors">
            <div className="w-12 h-12 rounded-full border border-[#F5B8CE] bg-[#FFF0F5] flex items-center justify-center text-[#C4436A] shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#2C2329]">
                Secure Payments
              </h4>
              <p className="text-xs text-[#8A737F]">
                100% safe & trusted
              </p>
            </div>
          </div>

          {/* 4. Easy Returns */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FFF5F8] transition-colors">
            <div className="w-12 h-12 rounded-full border border-[#F5B8CE] bg-[#FFF0F5] flex items-center justify-center text-[#C4436A] shrink-0 shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#2C2329]">
                Easy Returns
              </h4>
              <p className="text-xs text-[#8A737F]">
                Hassle free returns
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
