import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoryShortcuts: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView } = useStore();

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setActiveView('shop');
  };

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-[#F7E1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 overflow-x-auto py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-shortcut-${cat.slug}`}
              onClick={() => handleCategorySelect(cat.slug)}
              className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#F8D4E2] via-[#FFF0F5] to-[#E8D0F5] shadow-sm group-hover:shadow-md transition-all">
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-1 flex items-center justify-center border border-[#F5D8E4]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold tracking-wider text-[#3D2C35] group-hover:text-[#C4436A] transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
