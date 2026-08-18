import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart, setSelectedProduct, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWish = isInWishlist(product.id);

  const [activeImage, setActiveImage] = useState<string>(product.primaryImage);
  const [activeColor, setActiveColor] = useState<string>(product.colors?.[0]?.name || '');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, activeColor);
    
    // Tiny burst animation
    confetti({
      particleCount: 25,
      spread: 45,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#D85A80', '#F38BA0', '#E5C158'],
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-white rounded-2xl p-2 sm:p-3 border border-[#FBE6EF] hover:border-[#F3B8CE] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Area */}
      <div className="relative overflow-hidden rounded-xl aspect-square bg-[#FFF5F8]">
        {/* Primary and Hover Image */}
        <img
          src={activeImage || (isHovered && product.hoverImage ? product.hoverImage : product.primaryImage)}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-104"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase shadow-xs ${
                badge === 'BEST SELLER'
                  ? 'bg-[#C4436A] text-white'
                  : badge === 'NEW'
                  ? 'bg-[#8E44AD] text-white'
                  : badge === 'SALE'
                  ? 'bg-[#E74C3C] text-white'
                  : 'bg-[#E5C158] text-[#2C2329]'
              }`}
            >
              {badge}
            </span>
          ))}
          {discountPercent > 0 && (
            <span className="text-[9px] font-black bg-[#FF905A] text-white px-2 py-0.5 rounded-full uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 z-10 cursor-pointer ${
            inWish
              ? 'bg-[#C4436A] text-white shadow-md'
              : 'bg-white/80 backdrop-blur-xs text-[#55434E] hover:bg-white hover:text-[#C4436A]'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex justify-center z-10">
          <button
            onClick={handleQuickView}
            className="w-full bg-white/95 backdrop-blur-xs text-[#3D2C35] hover:text-[#C4436A] text-xs font-semibold py-1.5 rounded-lg shadow-md flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col justify-between flex-grow space-y-1.5">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#A08593] mb-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[#4A3842]">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
            {product.sizes && product.sizes.length > 0 && (
              <span className="text-[10px] text-[#8C7582] font-semibold bg-gray-100 px-1.5 py-0.5 rounded">
                {product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '+' : ''}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-xs sm:text-sm text-[#2C2329] line-clamp-1 group-hover:text-[#C4436A] transition-colors">
            {product.name}
          </h3>

          {/* More Colors Swatch Row */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              {product.colors.slice(0, 5).map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColor(c.name);
                    if (c.image) setActiveImage(c.image);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border border-gray-300 transition-transform ${
                    activeColor === c.name ? 'scale-125 border-[#C4436A] ring-1 ring-[#C4436A]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] text-[#7A6370] font-bold">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Price & Quick Add Button Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm sm:text-base text-[#2C2329]">
              ₹{product.price?.toLocaleString() || 0}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#A08593] line-through">
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Add Bag Button matching reference */}
          <button
            id={`quick-add-${product.id}`}
            onClick={handleQuickAdd}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D85A80] hover:bg-[#C4436A] text-white flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
            title="Quick add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
