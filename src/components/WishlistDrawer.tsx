import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, products, toggleWishlist, addToCart, setActiveView } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#FBE6EF] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#F7D8E4] flex items-center justify-between bg-[#FFF9FB]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C4436A] fill-[#C4436A]" />
            <h3 className="font-sans font-bold text-sm tracking-wider uppercase text-[#2C2329]">
              Wishlist ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-[#6B5562] hover:bg-[#FFF0F5] hover:text-[#C4436A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#C4436A] flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-display text-lg text-[#2C2329]">Your wishlist is empty</h4>
              <p className="text-xs text-[#8A737F] max-w-xs mx-auto">
                Save your favorite jewelry and aesthetic apparel to shop whenever you&apos;re ready.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setActiveView('shop');
                }}
                className="btn-tinkle font-sans font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full shadow-md cursor-pointer"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-[#FFF9FB] border border-[#FBE6EF]"
              >
                <img
                  src={item.primaryImage}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-[#F5D0DF] shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-[#2C2329] line-clamp-1">
                      {item.name}
                    </h5>
                    <span className="font-bold text-xs text-[#C4436A] block mt-1">
                      ₹{(item.price || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        addToCart(item, 1);
                        toggleWishlist(item.id);
                      }}
                      className="flex-1 btn-tinkle text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="p-1.5 text-[#9E8290] hover:text-[#C4436A] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 bg-[#FFF9FB] border-t border-[#F8D5E3]">
            <button
              onClick={() => {
                wishlistItems.forEach((p) => addToCart(p, 1));
                setIsWishlistOpen(false);
              }}
              className="w-full btn-tinkle-outline font-sans font-bold text-xs tracking-wider uppercase py-3 rounded-xl cursor-pointer"
            >
              Add All to Shopping Bag
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
