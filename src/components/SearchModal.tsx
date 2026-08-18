import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Star, ArrowUpDown, Filter, Sparkles, Tag } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setSelectedProduct, categories } = useStore();
  const [query, setQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'relevance' | 'low_to_high' | 'high_to_low' | 'rating'>('relevance');

  if (!isSearchOpen) return null;

  const popularSearches = ['Clover Necklace', 'Butterfly Earrings', 'Pastel Knit Top', 'Pearl Choker', 'Scented Candle', 'Tote Bag'];
  const budgetOptions = [
    { label: 'All Budgets', max: null },
    { label: 'Under ₹299', max: 299 },
    { label: 'Under ₹499', max: 499 },
    { label: 'Under ₹999', max: 999 },
    { label: 'Under ₹1,499', max: 1499 },
  ];

  // Filter products based on query, budget, category
  let filteredProducts = products.filter((p) => {
    // Search query match
    if (query.trim()) {
      const q = query.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.sku?.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Category filter
    if (selectedCategoryFilter !== 'all' && p.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
      return false;
    }

    // Budget price filter
    if (selectedBudget !== null && p.price > selectedBudget) {
      return false;
    }

    return true;
  });

  // Sort filtered products
  if (sortOrder === 'low_to_high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'high_to_low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const handleSelect = (product: any) => {
    setSelectedProduct(product);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#FBE6EF] relative">
        
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#F7D8E4] flex items-center gap-3 bg-[#FFF9FB]">
          <Search className="w-5 h-5 text-[#C4436A] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search clover pendants, hoop earrings, aesthetic tops..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base text-[#2C2329] placeholder-[#B49AA7] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C7582] hover:text-black font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full text-[#6B5562] hover:bg-[#FFF0F5] hover:text-[#C4436A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Bar (Budget & Sort Controls) */}
        <div className="p-3 bg-[#FFF5F8] border-b border-[#FCE1EB] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Budget Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="font-bold text-[#8C3A5A] text-[11px] shrink-0">Budget:</span>
            {budgetOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedBudget(opt.max)}
                className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-all cursor-pointer text-[11px] ${
                  selectedBudget === opt.max
                    ? 'bg-[#C4436A] text-white shadow-xs'
                    : 'bg-white text-[#5D4A55] border border-[#F5D0DF] hover:border-[#C4436A]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C4436A]" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="p-1.5 rounded-lg border border-[#F5D0DF] bg-white text-[11px] font-bold text-[#241A20] focus:outline-none cursor-pointer"
            >
              <option value="relevance">Sort: Best Match</option>
              <option value="low_to_high">Price: Low to High ⚡</option>
              <option value="high_to_low">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
            </select>
          </div>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-4">
          {!query.trim() && selectedBudget === null && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A737F] mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C4436A]" />
                  <span>Trending Search Tags</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FFF0F5] hover:bg-[#FCD2E2] text-[#C4436A] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-[#8A737F] text-xs space-y-2">
              <p className="font-semibold text-[#241A20]">No items match your filter criteria.</p>
              <p>Try clearing your budget filter or searching for another keyword.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedBudget(null);
                  setSelectedCategoryFilter('all');
                }}
                className="btn-tinkle text-xs font-bold px-4 py-2 rounded-xl mt-2 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A737F]">
                  Found {filteredProducts.length} items
                </h4>
                {selectedBudget !== null && (
                  <span className="text-[11px] text-[#C4436A] font-bold">
                    Filtered Under ₹{selectedBudget}
                  </span>
                )}
              </div>

              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FFF5F8] border border-transparent hover:border-[#FCD2E2] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="w-13 h-13 rounded-xl object-cover border border-[#F5D0DF]"
                    />
                    <div>
                      <h5 className="font-semibold text-xs sm:text-sm text-[#2C2329] group-hover:text-[#C4436A] transition-colors">
                        {product.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-[#8C7480] uppercase tracking-wider bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                          {product.category} {product.subCategory && `• ${product.subCategory}`}
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-display font-bold text-[#C4436A] block">
                      ₹{(product.price || 0).toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
