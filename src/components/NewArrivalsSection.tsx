import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products, setActiveView, setSelectedCategory } = useStore();

  const newArrivals = products.slice(6, 12);

  return (
    <section className="py-12 bg-[#FFF9FB] border-b border-[#F7E1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans font-bold text-sm sm:text-base tracking-[0.18em] text-[#2C2329] uppercase">
            NEW ARRIVALS
          </h2>

          <button
            id="newarrivals-view-all"
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('shop');
            }}
            className="text-xs font-semibold text-[#8C5D73] hover:text-[#C4436A] transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
