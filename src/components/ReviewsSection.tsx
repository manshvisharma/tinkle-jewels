import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews } = useStore();

  return (
    <section className="py-12 bg-white border-b border-[#F7E1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-sans font-bold text-sm sm:text-base tracking-[0.18em] text-[#2C2329] uppercase">
            WHAT OUR GIRLS SAY
          </h2>

          <div className="flex items-center gap-2">
            <button
              className="w-7 h-7 rounded-full bg-[#FFF0F5] border border-[#F6D0DF] text-[#C4436A] flex items-center justify-center hover:bg-[#C4436A] hover:text-white transition-colors cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="w-7 h-7 rounded-full bg-[#FFF0F5] border border-[#F6D0DF] text-[#C4436A] flex items-center justify-center hover:bg-[#C4436A] hover:text-white transition-colors cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonials 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFF9FB] border border-[#FCE1EB] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={rev.avatar}
                    alt={rev.customerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2C2329]">
                      — {rev.customerName}
                    </h4>
                    <span className="text-[10px] text-[#A28795]">Verified Buyer ✨</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4E3F47] italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* 5 Pink Stars matching reference */}
              <div className="pt-4 mt-2 border-t border-[#FEEAF2] flex items-center gap-1 text-[#E91E63]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
