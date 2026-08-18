import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TrendingSection: React.FC = () => {
  const { products, setActiveView, setSelectedCategory } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const trendingProducts = products.filter((p) => p.badges?.includes('TRENDING') || p.badges?.includes('BEST SELLER')).slice(0, 8);

  return (
    <section className="py-12 bg-white relative border-b border-[#F7E1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with View All */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-sans font-bold text-sm sm:text-base tracking-[0.18em] text-[#2C2329] uppercase">
              TRENDING NOW
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="trending-view-all"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('shop');
              }}
              className="text-xs font-semibold text-[#8C5D73] hover:text-[#C4436A] transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>
        </div>

        {/* Carousel Container with Left/Right Buttons */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            id="trending-scroll-left"
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#D85A80] hover:bg-[#C4436A] text-white flex items-center justify-center shadow-md z-20 transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer hidden sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Product Cards Row */}
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-none snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.map((product) => (
              <div key={product.id} className="snap-start min-w-[150px] sm:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            id="trending-scroll-right"
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#D85A80] hover:bg-[#C4436A] text-white flex items-center justify-center shadow-md z-20 transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer hidden sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
