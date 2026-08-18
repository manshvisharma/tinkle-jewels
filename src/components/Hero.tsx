import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  return (
    <section className="relative overflow-hidden bg-watercolor pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#F7E1EA]">
      {/* Decorative Hand-drawn Doodles & Sparkles in Background */}
      <div className="absolute top-6 left-12 text-[#F3A5BE] opacity-60 select-none pointer-events-none text-2xl font-casual animate-pulse">
        ✦
      </div>
      <div className="absolute top-28 left-[45%] text-[#E8A5BE] opacity-40 select-none pointer-events-none text-3xl font-casual">
        ✧
      </div>
      <div className="absolute bottom-12 left-16 text-[#EAA6C4] opacity-50 select-none pointer-events-none text-2xl font-casual">
        ♡
      </div>
      <div className="absolute top-16 right-10 text-[#D8B4E2] opacity-60 select-none pointer-events-none text-3xl font-casual">
        ✨
      </div>
      <div className="absolute bottom-6 right-20 text-[#EAA6C4] opacity-40 select-none pointer-events-none text-2xl font-casual">
        ✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Heading & CTA */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            <div className="space-y-1">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#241A20] font-normal tracking-tight leading-[1.1]">
                Made for
              </h1>
              <div className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#C4436A] pt-1 pb-2 leading-none">
                You, by You.
              </div>
            </div>

            {/* Subtitles matching reference */}
            <div className="space-y-1.5 pt-2 text-[#685560] font-sans">
              <p className="text-sm sm:text-base font-semibold tracking-wider uppercase text-[#8F536E]">
                Jewellery &bull; Clothing &bull; Lifestyle
              </p>
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#A08593]">
                Handmade &bull; Customized &bull; Unique
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-btn-explore"
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveView('shop');
                }}
                className="btn-tinkle font-sans font-bold text-xs sm:text-sm tracking-[0.18em] uppercase px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Micro perks */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#8A7480]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C4436A]" /> Anti-Tarnish
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[#C4436A]" /> Hypoallergenic
              </span>
              <span className="flex items-center gap-1">
                ✨ Free Gift Box
              </span>
            </div>
          </div>

          {/* Right Column: Polaroid / Collage Photos (Hidden on smartphones as requested) */}
          <div className="hidden md:block lg:col-span-7 relative">
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none grid grid-cols-2 gap-4 sm:gap-6 items-center">
              
              {/* Left Stack of Polaroid Cards */}
              <div className="space-y-4 sm:space-y-6">
                {/* Polaroid 1: Dainty Layered Necklace on Collarbone */}
                <div className="polaroid-card bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="overflow-hidden rounded-xl aspect-[4/5] bg-[#FDE8EE]">
                    <img
                      src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80"
                      alt="Dainty gold necklaces styling"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <span className="font-casual text-[#C4436A] text-lg font-bold">18k Golden Layering ✨</span>
                  </div>
                </div>

                {/* Polaroid 3: Stacked Rings on fingers */}
                <div className="polaroid-card bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="overflow-hidden rounded-xl aspect-[16/10] bg-[#FFF0F5]">
                    <img
                      src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
                      alt="Stacked gold rings on fingers"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-1.5 text-center">
                    <span className="font-casual text-[#8A5068] text-base font-semibold">Effortless everyday stacks ♡</span>
                  </div>
                </div>
              </div>

              {/* Right Stack of Polaroid Cards */}
              <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-8">
                {/* Polaroid 2: Girl in Purple "GOOD THINGS TAKE TIME" Graphic Tee */}
                <div className="polaroid-card bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="overflow-hidden rounded-xl aspect-[3/4] bg-[#F2E8FA]">
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                      alt="Lilac oversized aesthetic tee"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <span className="font-casual text-[#8E44AD] text-lg font-bold">Good Things Take Time 🌸</span>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="bg-gradient-to-r from-[#FFF0F5] to-[#F5E6F8] p-3 rounded-xl border border-[#F6D0DF] shadow-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C4436A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    5★
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#3B2C34]">4.9 / 5 Rating</p>
                    <p className="text-[10px] text-[#8C7480]">Over 1,200+ happy girlies</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
