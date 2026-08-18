import React from 'react';
import { useStore } from '../context/StoreContext';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveView, setSelectedCategory, setIsAccountOpen } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about-section" className="bg-[#FFF9FB] pt-14 pb-8 border-t border-[#F8D5E3] text-[#4A3842] relative">
      {/* Doodle Heart in Footer corner matching reference */}
      <div className="absolute right-12 bottom-20 text-[#F09AB8] text-4xl select-none pointer-events-none font-casual">
        ♡
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Column 1 & 2: Brand & Socials with Authentic Circle Badge */}
          <div className="lg:col-span-2 space-y-4">
            {/* Circular Stamp Logo */}
            <div className="inline-block">
              <div className="border border-[#F2B5CC] rounded-full p-2 bg-white shadow-xs inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FCD5E5] via-[#FFF0F5] to-[#E6D4F8] border border-[#F3B8CD] flex items-center justify-center text-[#C4436A] font-script text-2xl font-bold">
                  Tj
                </div>
                <div className="pr-3">
                  <span className="font-script text-2xl text-[#C4436A] block leading-none">
                    tinkle jewels
                  </span>
                  <span className="text-[9px] font-sans tracking-widest text-[#A28795] uppercase font-bold">
                    • Handmade • Customized • Unique
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#7A6370] leading-relaxed max-w-sm">
              Handcrafted with love for the dreamers, the lovers, and the trendsetters. 18k gold dipped, anti-tarnish, and skin-safe everyday luxury.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 text-[#C4436A] pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#FAD0E0] flex items-center justify-center hover:bg-[#C4436A] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#FAD0E0] flex items-center justify-center hover:bg-[#C4436A] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-[#FAD0E0] flex items-center justify-center hover:bg-[#C4436A] hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: SHOP */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs tracking-widest text-[#2C2329] uppercase">
              SHOP
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5562]">
              <li>
                <button onClick={() => handleCategoryClick('')} className="hover:text-[#C4436A] transition-colors cursor-pointer">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('jewellery')} className="hover:text-[#C4436A] transition-colors cursor-pointer">
                  Jewellery
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('clothing')} className="hover:text-[#C4436A] transition-colors cursor-pointer">
                  Clothing
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('lifestyle')} className="hover:text-[#C4436A] transition-colors cursor-pointer">
                  Lifestyle
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('')} className="hover:text-[#C4436A] transition-colors cursor-pointer">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: HELP */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs tracking-widest text-[#2C2329] uppercase">
              HELP
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5562]">
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">FAQs</span>
              </li>
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Shipping &amp; Delivery</span>
              </li>
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Returns &amp; Refunds</span>
              </li>
              <li>
                <button onClick={() => setIsAccountOpen(true)} className="hover:text-[#C4436A] cursor-pointer">
                  Order Tracking
                </button>
              </li>
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Contact Us</span>
              </li>
            </ul>
          </div>

          {/* Column 5: ABOUT */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs tracking-widest text-[#2C2329] uppercase">
              ABOUT
            </h4>
            <ul className="space-y-2 text-xs text-[#6B5562]">
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Our Story</span>
              </li>
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Careers</span>
              </li>
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-[#C4436A] cursor-pointer">Terms &amp; Conditions</span>
              </li>
            </ul>
          </div>

          {/* Column 6: CONTACT */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs tracking-widest text-[#2C2329] uppercase">
              CONTACT
            </h4>
            <div className="space-y-1.5 text-xs text-[#6B5562]">
              <p className="font-medium text-[#C4436A]">{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>

        </div>

        {/* Copyright Bar matching reference */}
        <div className="pt-6 border-t border-[#F8D5E3] text-center text-xs text-[#9E8290]">
          <p>© 2026 {settings.storeName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
