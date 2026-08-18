import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, User, Heart, ShoppingBag, Menu, X, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    activeCategories,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    setActiveView,
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedNestedSubcategory,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const handleNavClick = (
    view: 'storefront' | 'shop',
    categorySlug?: string,
    subcategorySlug?: string,
    nestedSlug?: string
  ) => {
    setActiveView(view);
    setSelectedCategory(categorySlug || null);
    setSelectedSubcategory(subcategorySlug || null);
    setSelectedNestedSubcategory(nestedSlug || null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FDE8EE] via-[#FBF0F5] to-[#F2E8FA] text-[#8C3A5A] text-[11px] sm:text-xs tracking-wider font-semibold py-1.5 px-4 text-center border-b border-[#F7D8E4] flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C4436A] animate-pulse" />
        <span>{settings.announcementText}</span>
      </div>

      {/* Main Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-[41px] z-40 border-b border-[#F7E1EA] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A3E46] hover:text-[#C4436A] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo matching reference */}
          <div className="flex items-center">
            <button
              id="header-brand-logo"
              onClick={() => handleNavClick('storefront')}
              className="text-left group cursor-pointer"
            >
              <span className="font-sans font-extrabold tracking-[0.18em] text-lg sm:text-2xl text-[#C4436A] uppercase transition-colors group-hover:text-[#AD3357] block leading-tight">
                {settings.storeName}
              </span>
              <span className="hidden sm:block text-[9px] font-medium tracking-[0.25em] text-[#A28292] uppercase font-sans">
                {settings.tagline}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 font-sans text-xs tracking-[0.15em] font-semibold text-[#4A3E46]">
            <button
              id="nav-home"
              onClick={() => handleNavClick('storefront')}
              className="text-[#C4436A] hover:text-[#AD3357] uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C4436A]"
            >
              HOME
            </button>

            <button
              id="nav-shop"
              onClick={() => handleNavClick('shop')}
              className="hover:text-[#C4436A] uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#C4436A] after:transition-all"
            >
              SHOP ALL
            </button>

            {/* Categories with Subcategories Dropdown */}
            <div className="relative group py-2">
              <button
                id="nav-categories"
                onClick={() => handleNavClick('shop')}
                className="hover:text-[#C4436A] uppercase transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>CATEGORIES</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dynamic Mega Dropdown Menu with Subcategories */}
              <div className="absolute top-full left-0 w-80 bg-white shadow-2xl rounded-2xl border border-[#FBE6EF] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0 z-50 divide-y divide-[#FDE8EE]">
                {activeCategories.map((cat) => (
                  <div key={cat.id} className="py-2.5 first:pt-1 last:pb-1">
                    <div
                      onClick={() => handleNavClick('shop', cat.slug)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#FFF2F7] cursor-pointer group/cat"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#241A20] group-hover/cat:text-[#C4436A]">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A08A95] bg-[#FFF0F5] px-2 py-0.5 rounded-full font-normal">
                        {cat.itemCount} items
                      </span>
                    </div>

                    {/* Subcategories under this category */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="grid grid-cols-2 gap-1 px-3 pt-1.5 pb-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavClick('shop', cat.slug, sub.slug);
                            }}
                            className="text-left py-1 px-2 rounded-lg text-[11px] font-medium text-[#7A6773] hover:text-[#C4436A] hover:bg-[#FFF5F8] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="text-[#F39CB8]">•</span>
                            <span className="truncate">{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              id="nav-newin"
              onClick={() => handleNavClick('shop')}
              className="hover:text-[#C4436A] uppercase transition-colors"
            >
              NEW IN
            </button>

            <button
              id="nav-about"
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavClick('storefront');
                }
              }}
              className="hover:text-[#C4436A] uppercase transition-colors"
            >
              ABOUT
            </button>
          </nav>

          {/* Right Action Icons: Search, User, Wishlist, Cart */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-[#4A3E46]">
            {/* Search Icon */}
            <button
              id="header-btn-search"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:text-[#C4436A] transition-colors rounded-full hover:bg-[#FFF0F5] cursor-pointer"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
            </button>

            {/* Account Icon */}
            <button
              id="header-btn-account"
              onClick={() => setIsAccountOpen(true)}
              className="p-1.5 hover:text-[#C4436A] transition-colors rounded-full hover:bg-[#FFF0F5] cursor-pointer"
              aria-label="My Account"
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </button>

            {/* Wishlist Icon */}
            <button
              id="header-btn-wishlist"
              onClick={() => setIsWishlistOpen(true)}
              className="p-1.5 hover:text-[#C4436A] transition-colors rounded-full hover:bg-[#FFF0F5] relative cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C4436A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon with badge matching reference */}
            <button
              id="header-btn-cart"
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-[#C4436A] transition-colors rounded-full hover:bg-[#FFF0F5] relative cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#D85A80] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#C4436A] transition-colors">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Subcategories Accordions */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#F7E1EA] px-5 py-4 shadow-xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-3 text-sm font-semibold tracking-wider text-[#4A3E46]">
              <button
                onClick={() => handleNavClick('storefront')}
                className="text-left py-2.5 border-b border-[#FFF0F5] text-[#C4436A] font-bold flex items-center justify-between"
              >
                <span>HOME</span>
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className="text-left py-2.5 border-b border-[#FFF0F5] hover:text-[#C4436A] flex items-center justify-between"
              >
                <span>SHOP ALL</span>
              </button>

              {/* Dynamic Categories & Subcategories on Mobile */}
              <div className="space-y-1.5 py-1">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#A88C9B] font-bold block px-1">
                  CATEGORIES
                </span>
                {activeCategories.map((cat) => {
                  const isExpanded = expandedMobileCategory === cat.id;
                  return (
                    <div key={cat.id} className="rounded-xl border border-[#FBE6EF] overflow-hidden bg-[#FFFDFE]">
                      <div
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                        className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-white to-[#FFF8FB]"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavClick('shop', cat.slug);
                          }}
                          className="font-bold text-xs text-[#33222B] hover:text-[#C4436A] flex items-center gap-1.5"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-[#A08A95] font-normal">({cat.itemCount})</span>
                        </button>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <ChevronDown className={`w-4 h-4 text-[#C4436A] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </div>

                      {/* Subcategories list inside accordion */}
                      {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="p-2.5 pt-0 bg-[#FFF5F8] border-t border-[#FDE8EE] grid grid-cols-2 gap-1.5">
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleNavClick('shop', cat.slug, sub.slug)}
                              className="text-left py-1.5 px-2 rounded-lg bg-white text-xs font-medium text-[#6B5563] hover:text-[#C4436A] hover:bg-[#FFEBF2] shadow-2xs flex items-center justify-between"
                            >
                              <span className="truncate">{sub.name}</span>
                              <ChevronRight className="w-3 h-3 text-[#D88CA7]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleNavClick('shop')}
                className="text-left py-2.5 border-b border-[#FFF0F5] hover:text-[#C4436A]"
              >
                NEW ARRIVALS
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAccountOpen(true);
                }}
                className="text-left py-2.5 text-[#C4436A] font-bold flex items-center justify-between"
              >
                <span>MY ACCOUNT</span>
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
