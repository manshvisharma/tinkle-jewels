import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';
import { X, ShieldCheck, CheckCircle2, CreditCard, QrCode, Building2, Truck, ArrowLeft, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    cartGrandTotal,
    appliedCoupon,
    createOrder,
    settings,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment'>('details');

  // Customer & Address Form
  const [formData, setFormData] = useState({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 12340',
    addressLine1: 'Flat 402, Rosewood Heights, Bandra West',
    addressLine2: 'Near Hill Road Market',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400050',
    type: 'home' as Address['type'],
    sameBilling: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<'manual_demo' | 'upi_qr' | 'bank_transfer' | 'cod'>('manual_demo');
  const [utrRef, setUtrRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    if ((paymentMethod === 'manual_demo' || paymentMethod === 'upi_qr' || paymentMethod === 'bank_transfer') && !utrRef.trim()) {
      alert('Please enter your 12-digit UTR or Transaction Reference number for payment verification.');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: 'addr_' + Date.now(),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
      type: formData.type,
      isDefault: true,
    };

    setTimeout(() => {
      createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
        paymentProofRef: utrRef,
      });

      setIsSubmitting(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D85A80', '#F38BA0', '#E5C158', '#D8B4E2'],
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#FBE6EF] relative max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#F7D8E4] bg-[#FFF9FB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('details')}
                className="p-1 rounded-full text-[#6B5562] hover:text-[#C4436A] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h3 className="font-sans font-bold text-base tracking-wider uppercase text-[#2C2329] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C4436A]" />
              <span>Secure Checkout</span>
            </h3>
          </div>

          <button
            id="btn-close-checkout"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-[#6B5562] hover:bg-[#FFF0F5] hover:text-[#C4436A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-[#FFF0F5] px-6 py-2.5 border-b border-[#FCD2E2] flex items-center justify-between text-xs font-semibold text-[#8C3A5A]">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'font-bold text-[#C4436A]' : 'opacity-70'}`}>
            <span className="w-5 h-5 rounded-full bg-[#C4436A] text-white flex items-center justify-center text-[10px]">1</span>
            <span>Shipping &amp; Contact</span>
          </div>
          <span className="text-[#F4A8C2]">────────</span>
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'font-bold text-[#C4436A]' : 'opacity-70'}`}>
            <span className="w-5 h-5 rounded-full bg-[#C4436A] text-white flex items-center justify-center text-[10px]">2</span>
            <span>Payment &amp; Confirmation</span>
          </div>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          {step === 'details' ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4436A] border-b border-[#FCE1EB] pb-1.5">
                  1. Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2C35] mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2C35] mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2C35] mb-1">Phone (for order updates) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4436A] border-b border-[#FCE1EB] pb-1.5">
                  2. Shipping Address
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2C35] mb-1">Flat / House No. / Street *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3D2C35] mb-1">Landmark / Area (Optional)</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#3D2C35] mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3D2C35] mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3D2C35] mb-1">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F5D0DF] focus:outline-none focus:border-[#C4436A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Pill */}
              <div className="bg-[#FFF9FB] p-4 rounded-2xl border border-[#FDE5EF] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8A737F]">Total payable ({cart.length} items):</span>
                  <p className="font-bold text-lg text-[#C4436A]">₹{cartGrandTotal.toFixed(2)}</p>
                </div>
                <button
                  type="submit"
                  className="btn-tinkle font-sans font-bold text-xs tracking-wider uppercase px-8 py-3 rounded-xl shadow-md cursor-pointer"
                >
                  CONTINUE TO PAYMENT →
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4436A] border-b border-[#FCE1EB] pb-1.5">
                  Select Payment Method
                </h4>

                <div className="space-y-2.5">
                  {/* Manual / Demo UPI Payment */}
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'manual_demo'
                        ? 'border-[#C4436A] bg-[#FFF0F5]'
                        : 'border-[#FBE6EF] hover:bg-[#FFF9FB]'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'manual_demo'}
                        onChange={() => setPaymentMethod('manual_demo')}
                        className="mt-1 accent-[#C4436A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#2C2329]">
                          <QrCode className="w-4 h-4 text-[#C4436A]" />
                          <span>Manual Payment (UPI QR / Direct Verification)</span>
                        </div>
                        <p className="text-xs text-[#7A6370] mt-1">
                          Scan store QR code using Google Pay, PhonePe, Paytm or BHIM. Enter your UTR / Ref Number below for admin confirmation.
                        </p>
                      </div>
                    </label>

                    {/* QR Code and Instructions display when selected */}
                    {paymentMethod === 'manual_demo' && (
                      <div className="mt-4 pt-3 border-t border-[#F8D5E3] space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-2xl border border-[#F5D0DF]">
                          <div className="w-28 h-28 bg-white border-2 border-[#C4436A] rounded-xl flex flex-col items-center justify-center p-1.5 shadow-xs shrink-0">
                            {settings.manualUpi?.qrCodeUrl ? (
                              <img
                                src={settings.manualUpi.qrCodeUrl}
                                alt="Store Payment QR Code"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-center p-1">
                                <QrCode className="w-10 h-10 text-[#C4436A] mx-auto mb-1" />
                                <span className="text-[9px] font-bold text-[#241A20] block">SCAN &amp; PAY</span>
                                <span className="text-[8px] text-gray-500 block">All UPI Apps</span>
                              </div>
                            )}
                          </div>

                          <div className="text-xs space-y-1 text-[#241A20] flex-1">
                            <p className="font-bold text-sm text-[#C4436A]">
                              Payee: {settings.manualUpi?.payeeName || 'JewelAura Merchant'}
                            </p>
                            <p className="font-mono text-xs font-semibold bg-[#FFF0F5] px-2 py-1 rounded-md inline-block text-[#241A20] border border-[#FCE1EB]">
                              UPI ID: {settings.manualUpi?.upiId || 'jewelaura@upi'}
                            </p>
                            <p className="text-[11px] text-[#7A6370] pt-1">
                              {settings.manualUpi?.instructions || 'Scan the QR code with any UPI app. After payment, copy the 12-digit UTR/Ref Number and paste it below.'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#241A20] mb-1">
                            Enter 12-Digit UTR / UPI Reference / Transaction ID *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 423819204812"
                            value={utrRef}
                            onChange={(e) => setUtrRef(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono text-xs font-bold focus:outline-none focus:border-[#C4436A]"
                          />
                        </div>

                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
                          ⏳ <strong>Wait for payment confirmation:</strong> Once placed, order status will show <em>Pending Verification</em>. Our Admin will verify the UTR and confirm your order shortly!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#C4436A] bg-[#FFF0F5]'
                        : 'border-[#FBE6EF] hover:bg-[#FFF9FB]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-[#C4436A]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#2C2329]">
                        <Building2 className="w-4 h-4 text-[#C4436A]" />
                        <span>Direct Bank IMPS / NEFT</span>
                      </div>
                      <p className="text-xs text-[#7A6370] mt-1">
                        Transfer directly to store account (HDFC Bank: 5020008892182, IFSC: HDFC0001234).
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#C4436A] bg-[#FFF0F5]'
                        : 'border-[#FBE6EF] hover:bg-[#FFF9FB]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#C4436A]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#2C2329]">
                        <Truck className="w-4 h-4 text-[#C4436A]" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-[#7A6370] mt-1">
                        Pay with cash upon delivery at your doorstep.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Final Review Box */}
              <div className="bg-[#FFF9FB] p-5 rounded-2xl border border-[#FDE5EF] space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#3D2C35]">Order Summary</h5>
                <div className="space-y-1.5 text-xs text-[#6B5562]">
                  <div className="flex justify-between">
                    <span>Deliver to</span>
                    <span className="font-semibold text-[#2C2329] text-right truncate max-w-xs">
                      {formData.fullName} ({formData.pincode})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Total ({cart.length} items)</span>
                    <span>₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#2C2329] pt-2 border-t border-[#F8D5E3]">
                    <span>Grand Total</span>
                    <span className="text-[#C4436A]">₹{cartGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                id="btn-confirm-place-order"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full btn-tinkle font-sans font-bold text-xs sm:text-sm tracking-widest uppercase py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSubmitting ? 'CREATING YOUR ORDER...' : `PLACE ORDER • ₹${cartGrandTotal.toFixed(2)}`}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7480]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted &bull; 100% Safe Checkout</span>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
