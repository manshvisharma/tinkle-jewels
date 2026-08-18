import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  X,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  Sparkles,
  Ruler,
  MessageSquarePlus,
  ThumbsUp,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, setIsCheckoutOpen, reviews, addReview, settings } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>(product?.primaryImage || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(
    Array.isArray(product?.sizes) ? (product?.sizes[0] as string) : 'Standard'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'invalid'>('idle');
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');

  // Customer Review Form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) return null;

  const inWish = isInWishlist(product.id);
  const allImages = [product.primaryImage, ...(product.galleryImages || [])];

  // Dynamic price depending on variant/color
  const activeVariant = product.variants?.find((v) =>
    (v.attributes.color === selectedColor || !selectedColor) &&
    (v.attributes.size === selectedSize || !selectedSize)
  );
  const currentPrice = activeVariant ? activeVariant.price : product.price;

  // Social Proof Rating Logic
  const displayRating = settings.fakeRatingsEnabled
    ? Math.max(settings.fakeRatingBase || 4.8, product.rating)
    : product.rating;
  const displayReviewCount = settings.fakeRatingsEnabled
    ? product.reviewCount + (settings.fakeRatingCountBoost || 45)
    : product.reviewCount;

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(product, quantity, selectedColor, selectedSize, undefined, activeVariant);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#D85A80', '#F38BA0', '#E5C158'],
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, undefined, activeVariant);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setPincodeStatus('invalid');
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      setPincodeStatus('available');
    }, 400);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    addReview({
      productId: product.id,
      customerName: reviewName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: reviewRating,
      title: reviewTitle || 'Verified Customer Review',
      comment: reviewComment,
      verifiedPurchase: true,
    });
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#38ef7d'] });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#FBE6EF] relative max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          id="btn-close-product-detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-[#F7D8E4] text-[#4A3842] hover:bg-[#C4436A] hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Gallery Images */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FFF5F8] border border-[#FCE1EB]">
                <img
                  src={selectedImage || product.primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all cursor-pointer ${
                    inWish ? 'bg-[#C4436A] text-white' : 'bg-white/90 text-[#4A3842] hover:text-[#C4436A]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        (selectedImage || product.primaryImage) === img
                          ? 'border-[#C4436A] shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info & Actions */}
            <div className="md:col-span-6 space-y-5">
              <div>
                {/* Badges */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[#C4436A] bg-[#FFF0F5] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {product.category} {product.subCategory && `• ${product.subCategory}`}
                  </span>
                  {product.badges?.map((badge) => (
                    <span key={badge} className="badge-tinkle">
                      {badge}
                    </span>
                  ))}
                </div>

                <h1 className="font-display text-xl sm:text-2xl text-[#241A20] leading-snug font-medium">
                  {product.name}
                </h1>

                {/* Rating Display */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#2C2329]">{displayRating}</span>
                  <span className="text-xs text-[#8A737F]">({displayReviewCount} verified reviews)</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-[#C4436A] font-semibold underline ml-1 cursor-pointer"
                  >
                    Read Reviews
                  </button>
                </div>

                {/* Price (Myntra Style) */}
                <div className="flex items-baseline gap-2.5 mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#241A20]">
                    ₹{(currentPrice || 0).toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <>
                      <span className="text-sm sm:text-base text-[#7A6370] line-through font-medium">
                        MRP ₹{product.originalPrice?.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#FF905A] bg-[#FFF5F0] px-2 py-0.5 rounded-md">
                        ({Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] font-bold text-[#03A685] mt-1">inclusive of all taxes &bull; Free express delivery over ₹999</p>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#5D4A55] leading-relaxed">
                {product.shortDescription}
              </p>

              {/* MORE COLORS (Myntra Style Image Swatches) */}
              {(product.colors?.length || 0) > 0 && (
                <div className="space-y-2 pt-1 border-t border-[#F8D5E3]/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#241A20] uppercase tracking-wider text-[11px]">
                      MORE COLORS: <span className="text-[#C4436A] normal-case font-extrabold">{selectedColor || 'Default'}</span>
                    </span>
                    <span className="text-[10px] text-[#7A6370] font-medium">{product.colors?.length} options</span>
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                    {product.colors?.map((c) => {
                      const isSel = selectedColor === c.name;
                      const swatchImg = c.image || product.primaryImage;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setSelectedColor(c.name);
                            if (c.image) setSelectedImage(c.image);
                          }}
                          className={`group relative flex flex-col items-center shrink-0 transition-all cursor-pointer ${
                            isSel ? 'scale-105' : 'hover:opacity-90'
                          }`}
                        >
                          <div className={`w-14 h-18 rounded-lg overflow-hidden border-2 bg-gray-100 relative shadow-2xs transition-all ${
                            isSel ? 'border-[#C4436A] ring-2 ring-[#FFD8E5]' : 'border-gray-200 opacity-80 group-hover:opacity-100'
                          }`}>
                            <img src={swatchImg} alt={c.name} className="w-full h-full object-cover" />
                            <span
                              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          </div>
                          <span className={`text-[10px] font-semibold mt-1 truncate max-w-[60px] ${
                            isSel ? 'text-[#C4436A] font-bold' : 'text-[#7A6370]'
                          }`}>
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SELECT SIZE (Myntra Circular Buttons & Size Chart) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-[#F8D5E3]/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#241A20] uppercase tracking-wider text-[11px]">
                      SELECT SIZE
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="text-[11px] font-bold text-[#C4436A] hover:underline flex items-center gap-0.5 uppercase tracking-wider cursor-pointer"
                    >
                      <span>SIZE CHART</span>
                      <Ruler className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {product.sizes.map((s) => {
                      const isSel = selectedSize === s;
                      // Determine out of stock simulation (e.g. 36 or specific sizes if stock is 0)
                      const isOos = s === '36' && product.id === 'prod_shirt_1';
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={isOos}
                          onClick={() => setSelectedSize(s)}
                          className={`relative w-12 h-12 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isOos
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                              : isSel
                              ? 'bg-[#241A20] text-white border-2 border-[#241A20] shadow-md scale-105'
                              : 'bg-white text-[#241A20] border border-[#E0D0D8] hover:border-[#C4436A] hover:text-[#C4436A]'
                          }`}
                        >
                          <span>{s}</span>
                          {/* Cross-out diagonal slash for out of stock sizes */}
                          {isOos && (
                            <span className="absolute w-[125%] h-[1.5px] bg-gray-400/80 -rotate-45" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Size Recommendation Pill (Myntra Style) */}
                  <div className="flex items-center gap-2 p-2.5 bg-[#FFF0F5] border border-[#F5D0DF] rounded-xl text-[11px] text-[#241A20]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C4436A] shrink-0" />
                    <span>
                      We recommend size <strong className="text-[#C4436A]">{selectedSize || 'M'}</strong> based on standard fit guide &amp; sizing history.
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#F5D0DF] rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-[#C4436A] hover:bg-[#FFF0F5] rounded-lg transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#2C2329]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-[#C4436A] hover:bg-[#FFF0F5] rounded-lg transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    id="btn-add-to-cart-modal"
                    onClick={handleAddToCart}
                    className="flex-1 btn-tinkle font-sans font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  id="btn-buy-now-modal"
                  onClick={handleBuyNow}
                  className="w-full bg-[#241A20] hover:bg-[#3D2934] text-white font-sans font-bold text-xs sm:text-sm tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  BUY NOW • EXPRESS CHECKOUT
                </button>
              </div>

              {/* Pincode checker */}
              <div className="pt-3 border-t border-[#F8D5E3]">
                <form onSubmit={handleCheckPincode} className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter pincode for delivery check"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      setPincodeStatus('idle');
                    }}
                    className="flex-1 text-xs px-3.5 py-2 rounded-lg border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold px-4 py-2 bg-[#FFF0F5] border border-[#F5D0DF] text-[#C4436A] hover:bg-[#C4436A] hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus === 'available' && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Delivery available to {pincode}! Expected within 3-4 days. Free delivery available.
                  </p>
                )}
                {pincodeStatus === 'invalid' && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1.5">
                    Please enter a valid 6-digit Indian PIN code.
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-[#7A6370]">
                <div className="flex items-center gap-1.5 p-2 bg-[#FFF9FB] rounded-lg border border-[#FBE6EF]">
                  <Truck className="w-4 h-4 text-[#C4436A] shrink-0" />
                  <span>Free shipping above ₹999</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-[#FFF9FB] rounded-lg border border-[#FBE6EF]">
                  <ShieldCheck className="w-4 h-4 text-[#C4436A] shrink-0" />
                  <span>Anti-Tarnish Polish</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-[#FFF9FB] rounded-lg border border-[#FBE6EF]">
                  <RefreshCw className="w-4 h-4 text-[#C4436A] shrink-0" />
                  <span>Easy 7-day returns</span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Tabs: Description, Care, Shipping, Reviews */}
          <div className="mt-8 pt-6 border-t border-[#F8D5E3]">
            <div className="flex flex-wrap border-b border-[#F5D0DF] gap-4 sm:gap-6 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-all cursor-pointer ${
                  activeTab === 'details' ? 'text-[#C4436A] border-b-2 border-[#C4436A]' : 'text-[#8A737F] hover:text-[#2C2329]'
                }`}
              >
                Description &amp; Highlights
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 transition-all cursor-pointer ${
                  activeTab === 'care' ? 'text-[#C4436A] border-b-2 border-[#C4436A]' : 'text-[#8A737F] hover:text-[#2C2329]'
                }`}
              >
                Material &amp; Care
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-all cursor-pointer ${
                  activeTab === 'reviews' ? 'text-[#C4436A] border-b-2 border-[#C4436A]' : 'text-[#8A737F] hover:text-[#2C2329]'
                }`}
              >
                Customer Reviews ({displayReviewCount})
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-[#5D4A55] leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  
                  {product.highlights && product.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <h4 className="font-bold text-xs text-[#241A20] uppercase tracking-wider">Key Highlights:</h4>
                      <ul className="space-y-1 pl-4 list-disc text-xs text-[#4A3842]">
                        {product.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="font-semibold text-[#3D2C35] pt-1">Base Material: {product.material}</p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p>{product.careInstructions || 'Safe for daily showers. Wipe with the included micro-suede polishing cloth after workouts or perfume exposure.'}</p>
                  <p className="text-xs text-[#7A6370] pt-2">
                    Avoid spraying concentrated chemical perfumes directly onto stones. Store in your complimentary Tinkle signature velvet box when not in use.
                  </p>
                </div>
              )}

              {/* REVIEWS TAB & CUSTOMER SUBMISSION FORM */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF]">
                    <div className="flex items-center gap-3">
                      <div className="text-center pr-3 border-r border-[#F7D8E4]">
                        <span className="text-3xl font-display font-bold text-[#C4436A] block">{displayRating}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#241A20]">Real Customer Experiences</h4>
                        <span className="text-xs text-[#7A6370]">Based on {displayReviewCount} verified buyers</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn-tinkle text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
                    </button>
                  </div>

                  {/* Submit Review Form */}
                  {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="p-5 bg-white rounded-2xl border border-[#F5B8CE] shadow-sm space-y-3 text-xs">
                      <h4 className="font-bold text-sm text-[#8C3A5A]">Share Your Review &amp; Photos</h4>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Your Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="p-1 cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pooja Verma"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full p-2 rounded-xl border border-[#F5D0DF]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Headline / Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Dreamy quality &amp; anti-tarnish!"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full p-2 rounded-xl border border-[#F5D0DF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">Detailed Review *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Tell us about the shine, fit, packaging, or styling..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full p-2 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>

                      <button type="submit" className="btn-tinkle font-bold px-6 py-2.5 rounded-xl cursor-pointer">
                        Post Verified Review
                      </button>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {productReviews.length > 0 ? (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={rev.avatar} alt={rev.customerName} className="w-8 h-8 rounded-full object-cover border" />
                              <div>
                                <strong className="text-xs text-[#241A20] block">{rev.customerName}</strong>
                                <span className="text-[10px] text-emerald-700 font-semibold">✓ Verified Buyer</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-[#8C7582]">{rev.date}</span>
                          </div>

                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>

                          <p className="font-bold text-xs text-[#241A20]">{rev.title}</p>
                          <p className="text-xs text-[#5D4A55]">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#8C7582] text-center py-4">Be the first to leave a review for {product.name}!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* SIZE CHART MODAL OVERLAY */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#F5D0DF] space-y-4 relative">
            <div className="flex items-center justify-between border-b border-[#FCE1EB] pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#C4436A]" />
                <h3 className="font-display font-bold text-lg text-[#241A20]">
                  Size Guide &amp; Measurements
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeChart(false)}
                className="p-1.5 text-gray-500 hover:text-black rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7A6370]">
              Standard garment &amp; jewelry sizing for <strong>{product.name}</strong>. All dimensions in inches (and cm equivalent).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FFF0F5] text-[#C4436A] font-bold border-b border-[#F5D0DF]">
                    <th className="p-2.5 rounded-tl-xl">Size</th>
                    <th className="p-2.5">Chest / Bust</th>
                    <th className="p-2.5">Garment Length</th>
                    <th className="p-2.5 rounded-tr-xl">Fit Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-[#241A20]">
                  <tr>
                    <td className="p-2.5 font-bold text-[#C4436A]">36 / S</td>
                    <td className="p-2.5">38 in (96 cm)</td>
                    <td className="p-2.5">27.5 in</td>
                    <td className="p-2.5">Slim Fit</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-bold text-[#C4436A]">38 / M</td>
                    <td className="p-2.5">40 in (101 cm)</td>
                    <td className="p-2.5">28.0 in</td>
                    <td className="p-2.5">Regular Fit</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#C4436A]">40 / L</td>
                    <td className="p-2.5">42 in (106 cm)</td>
                    <td className="p-2.5">28.5 in</td>
                    <td className="p-2.5">Regular Fit</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-2.5 font-bold text-[#C4436A]">42 / XL</td>
                    <td className="p-2.5">44 in (112 cm)</td>
                    <td className="p-2.5">29.0 in</td>
                    <td className="p-2.5">Relaxed Fit</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#C4436A]">44 / XXL</td>
                    <td className="p-2.5">46 in (117 cm)</td>
                    <td className="p-2.5">29.5 in</td>
                    <td className="p-2.5">Comfort Fit</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#FFF5F8] border border-[#FCE1EB] rounded-2xl text-[11px] text-[#8C3A5A] space-y-1">
              <strong>💡 How to measure:</strong>
              <p>Measure under your arms around the fullest part of your chest. If you prefer a loose relaxed fit, select one size larger.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="w-full btn-tinkle py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Got It &bull; Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
