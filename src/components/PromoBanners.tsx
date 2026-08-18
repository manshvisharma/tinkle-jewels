import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Flame, HeartHandshake, Gem, Shirt, Coffee } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView } = useStore();

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setActiveView('shop');
  };

  // Find or fallback to the 3 main pillars
  const jewCategory = categories.find((c) => c.slug === 'jewellery') || {
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Anti-tarnish, water-resistant dainty gold & silver pieces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
  };

  const clothCategory = categories.find((c) => c.slug === 'clothing') || {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Aesthetic knitwear, pastel co-ords & dream fits',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
  };

  const lifeCategory = categories.find((c) => c.slug === 'lifestyle') || {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Aesthetic scented candles, tote bags & desk vibes',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
  };

  const banners = [
    {
      cat: jewCategory,
      badge: 'Bestselling Anti-Tarnish',
      sub: 'Waterproof • 18K Plated',
      icon: Gem,
      gradient: 'from-[#FFE8F0] via-[#FFF3F7] to-[#FFEBF2]',
      border: 'border-[#F8CCD9]',
      accentColor: 'text-[#C4436A]',
      btnBg: 'bg-[#C4436A]',
    },
    {
      cat: clothCategory,
      badge: 'New Season Drop',
      sub: 'Knitwear • Co-ords',
      icon: Shirt,
      gradient: 'from-[#F5EAFA] via-[#FAF2FC] to-[#F2E4F7]',
      border: 'border-[#E9CEF2]',
      accentColor: 'text-[#8E44AD]',
      btnBg: 'bg-[#8E44AD]',
    },
    {
      cat: lifeCategory,
      badge: 'Self-Care & Aesthetic',
      sub: 'Soy Wax • Tote Bags',
      icon: Coffee,
      gradient: 'from-[#FFF0E8] via-[#FFF8F2] to-[#FFF3EC]',
      border: 'border-[#F8D8C8]',
      accentColor: 'text-[#D35400]',
      btnBg: 'bg-[#D35400]',
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-b from-[#FFF9FB] to-white border-b border-[#FBE6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Gen-Z Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFF0F5] text-[#C4436A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-display text-lg sm:text-2xl text-[#241A20] font-bold">
              Shop The 3 Pillars
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-[#8C7582] hidden sm:inline">
            Directly handcrafted in our boutique studio
          </span>
        </div>

        {/* 3 Pillars Compact Bento Grid / Horizontal Scroll on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {banners.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                id={`banner-pillar-${item.cat.slug}`}
                onClick={() => handleCategorySelect(item.cat.slug)}
                className={`group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-4 sm:p-5 border ${item.border} shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3`}
              >
                {/* Text Side */}
                <div className="space-y-1 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 shadow-2xs text-[#241A20]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className={`font-display text-xl sm:text-2xl font-bold ${item.accentColor} group-hover:scale-102 transition-transform`}>
                    {item.cat.name}
                  </h3>

                  <p className="text-[11px] text-[#7A6370] font-medium leading-tight line-clamp-1">
                    {item.sub}
                  </p>

                  <div className="pt-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-white ${item.btnBg} px-3 py-1 rounded-full shadow-2xs inline-flex items-center gap-1 group-hover:gap-1.5 transition-all`}>
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Circular Aesthetic Photo (Compact, no huge vertical overflow on mobile) */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.cat.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80'}
                    alt={item.cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
