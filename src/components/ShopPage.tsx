import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, Sparkles, Filter, Check, Tag } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { activeProducts, selectedCategory, setSelectedCategory, activeCategories } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating' | 'newest'>('featured');
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');

  const budgetOptions = [
    { label: 'All Budgets', max: null },
    { label: 'Under ₹299', max: 299 },
    { label: 'Under ₹499', max: 499 },
    { label: 'Under ₹999', max: 999 },
    { label: 'Under ₹1,499', max: 1499 },
  ];

  // Active Category Object
  const activeCategoryObj = activeCategories.find(
    (c) => c.slug.toLowerCase() === (selectedCategory || '').toLowerCase()
  );

  // Filter products
  let filtered = activeProducts.filter((p) => {
    // Category match
    if (selectedCategory && selectedCategory !== 'all') {
      if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // Subcategory match
    if (selectedSubcat !== 'all') {
      if (p.subCategory?.toLowerCase() !== selectedSubcat.toLowerCase()) {
        return false;
      }
    }

    // Budget Price match
    if (budgetFilter !== null && p.price > budgetFilter) {
      return false;
    }

    return true;
  });

  // Sort products
  if (sortBy === 'price_low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'newest') {
    filtered.reverse();
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FFFDFE] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Banner Title Area */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C4436A] uppercase bg-[#FFF0F5] px-3 py-1 rounded-full border border-[#FBE6EF]">
            {selectedCategory ? `${selectedCategory} Collection` : 'All Studio Drops'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#241A20] font-normal">
            {activeCategoryObj?.name || 'Explore Curated Boutique Picks'}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6370]">
            Handmade luxury jewellery, premium aesthetic apparel, and playful lifestyle accents.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcat('all');
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              !selectedCategory
                ? 'bg-[#C4436A] text-white shadow-md'
                : 'bg-[#FFF0F5] text-[#4A3842] hover:bg-[#FCD2E2]'
            }`}
          >
            All Products ({activeProducts.length})
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setSelectedSubcat('all');
              }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-[#C4436A] text-white shadow-md'
                  : 'bg-[#FFF0F5] text-[#4A3842] hover:bg-[#FCD2E2]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategories (if selected category has them) */}
        {activeCategoryObj?.subcategories && activeCategoryObj.subcategories.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-[#8C3A5A]">Subcategory:</span>
            <button
              onClick={() => setSelectedSubcat('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedSubcat === 'all' ? 'bg-[#241A20] text-white' : 'bg-white border border-[#F5D0DF] text-[#5D4A55]'
              }`}
            >
              All {activeCategoryObj.name}
            </button>
            {activeCategoryObj.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcat(sub.name)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedSubcat === sub.name ? 'bg-[#241A20] text-white' : 'bg-white border border-[#F5D0DF] text-[#5D4A55]'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Filters & Sorting Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#FDE5EF] shadow-xs">
          
          {/* Quick Budget Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-bold text-[#8C3A5A] flex items-center gap-1 shrink-0">
              <Tag className="w-3.5 h-3.5 text-[#C4436A]" />
              <span>Budget:</span>
            </span>
            {budgetOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setBudgetFilter(opt.max)}
                className={`px-3 py-1 rounded-full font-semibold text-xs shrink-0 transition-all cursor-pointer ${
                  budgetFilter === opt.max
                    ? 'bg-[#C4436A] text-white shadow-xs'
                    : 'bg-[#FFF0F5] text-[#5D4A55] border border-[#F5D0DF] hover:border-[#C4436A]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7A6370]">
              Showing <strong>{filtered.length}</strong> items
            </span>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C4436A]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold bg-[#FFF0F5] border border-[#F5D0DF] text-[#241A20] rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price_low">Price: Low to High ⚡</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated ⭐</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#FDE5EF] p-8 space-y-3">
            <p className="text-base font-bold text-[#241A20]">No products match the selected filters.</p>
            <p className="text-xs text-[#7A6370]">Try selecting &ldquo;All Budgets&rdquo; or a different category.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setBudgetFilter(null);
                setSelectedSubcat('all');
              }}
              className="btn-tinkle text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
