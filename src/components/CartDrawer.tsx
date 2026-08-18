import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
    setIsCheckoutOpen,
    setActiveView,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - (cartSubtotal - discountAmount));
  const progressPercent = Math.min(100, Math.round(((cartSubtotal - discountAmount) / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
      confetti({ particleCount: 30, spread: 45, colors: ['#D85A80', '#E5C158'] });
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#FBE6EF] animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-5 border-b border-[#F7D8E4] flex items-center justify-between bg-[#FFF9FB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C4436A]" />
            <h3 className="font-sans font-bold text-sm tracking-wider uppercase text-[#2C2329]">
              Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            id="btn-close-cart"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-[#6B5562] hover:bg-[#FFF0F5] hover:text-[#C4436A] transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#FFF0F5] px-5 py-3 border-b border-[#FCD2E2]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C3A5A] mb-1.5">
            {amountToFreeShipping === 0 ? (
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> ✨ You unlocked FREE Delivery!
              </span>
            ) : (
              <span>Add <strong>₹{amountToFreeShipping}</strong> more for <strong>FREE Delivery</strong></span>
            )}
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#FCE1EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D85A80] to-[#C4436A] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#C4436A] flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-display text-lg text-[#2C2329]">Your bag is empty!</h4>
              <p className="text-xs text-[#8A737F] max-w-xs mx-auto">
                Explore our dainty necklaces, viral graphic tees, and minimal rings.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('shop');
                }}
                className="btn-tinkle font-sans font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full shadow-md cursor-pointer"
              >
                DISCOVER BEST SELLERS
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-[#FFF9FB] border border-[#FBE6EF] relative group"
              >
                {/* Product Image */}
                <img
                  src={item.product.primaryImage}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-[#F5D0DF] shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-[#2C2329] line-clamp-1">
                      {item.product.name}
                    </h5>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-[11px] text-[#8C7480] mt-0.5">
                        {[item.selectedColor, item.selectedSize].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    <span className="font-bold text-xs text-[#C4436A] block mt-1">
                      ₹{(item.price || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity controls & remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#F5D0DF] rounded-lg bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-[#C4436A] hover:bg-[#FFF0F5] rounded-l-lg transition-colors cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#2C2329]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-[#C4436A] hover:bg-[#FFF0F5] rounded-r-lg transition-colors cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#9E8290] hover:text-[#C4436A] p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area: Coupons, Summary, Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#F8D5E3] bg-[#FFF9FB] space-y-4">
            
            {/* Coupon Engine */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount.toLocaleString()})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700 text-[11px] font-bold underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. TINKLE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-white border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                  />
                  <button
                    type="submit"
                    className="btn-tinkle-outline text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-600 font-semibold">{couponSuccess}</p>}
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#5D4A55] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (3%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#2C2329] pt-2 border-t border-[#F8D5E3]">
                <span>Total Amount</span>
                <span className="text-[#C4436A] text-base">₹{cartGrandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="btn-proceed-to-checkout"
              onClick={handleProceedToCheckout}
              className="w-full btn-tinkle font-sans font-bold text-xs sm:text-sm tracking-widest uppercase py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
