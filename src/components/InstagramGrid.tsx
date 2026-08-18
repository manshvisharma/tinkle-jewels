import React from 'react';
import { Instagram } from 'lucide-react';

export const InstagramGrid: React.FC = () => {
  const instaImages = [
    {
      id: 'ig_1',
      url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80',
      alt: 'Collarbone necklace stack',
    },
    {
      id: 'ig_2',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
      alt: 'Pink aesthetic streetwear',
    },
    {
      id: 'ig_3',
      url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
      alt: 'Stacked rings on hand',
    },
    {
      id: 'ig_4',
      url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
      alt: 'Golden jewellery arrangement',
    },
    {
      id: 'ig_5',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      alt: 'Lavender cardigan set',
    },
  ];

  return (
    <section className="py-12 bg-[#FFF9FB] border-b border-[#F7E1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-sans font-bold text-sm sm:text-base tracking-[0.18em] text-[#C4436A] uppercase">
            #TINKLEJEWELS
          </h2>
          <p className="text-xs text-[#8A737F] mt-0.5">
            Tag us to get featured
          </p>
        </div>

        {/* 6-Item Grid matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instaImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FDE8EE] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#C4436A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          ))}

          {/* 6th Card: Follow Us Card */}
          <a
            id="instagram-follow-card"
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group aspect-square rounded-2xl bg-gradient-to-br from-[#FFE8F1] via-[#FFF3F8] to-[#F3DBF7] border border-[#F9C9DD] p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#9A627B] uppercase block">
              FOLLOW US
            </span>
            <span className="font-bold text-xs sm:text-sm text-[#C4436A] mt-1 mb-2">
              @tinklejewels
            </span>
            <div className="w-9 h-9 rounded-full bg-white text-[#C4436A] flex items-center justify-center shadow-sm group-hover:bg-[#C4436A] group-hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </div>
          </a>
        </div>

      </div>
    </section>
  );
};
