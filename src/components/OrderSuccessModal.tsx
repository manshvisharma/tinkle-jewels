import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Printer, ArrowRight, Package, Truck, Sparkles, MapPin } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen, lastCreatedOrder, setIsAccountOpen, setActiveView } = useStore();

  if (!isOrderSuccessOpen || !lastCreatedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleViewInAccount = () => {
    setIsOrderSuccessOpen(false);
    setIsAccountOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#FBE6EF] relative max-h-[92vh] flex flex-col">
        
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-[#FDE8EE] via-[#FFF0F5] to-[#F2E8FA] p-6 sm:p-8 text-center border-b border-[#F7D8E4] relative">
          <div className="w-16 h-16 rounded-full bg-[#C4436A] text-white flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="font-casual text-[#C4436A] text-2xl font-bold">Yay, it&apos;s confirmed! ✨</span>
          <h2 className="font-display text-2xl sm:text-3xl text-[#241A20] font-normal mt-1">
            Thank you, {lastCreatedOrder.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-[#7A6370] mt-1">
            We&apos;ve sent a confirmation email to <strong>{lastCreatedOrder.customerEmail}</strong>
          </p>
        </div>

        {/* Invoice Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Order Details Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FFF9FB] rounded-2xl border border-[#FDE5EF] text-xs">
            <div>
              <span className="text-[#8C7480] block text-[10px] uppercase font-bold">Order Number</span>
              <strong className="text-[#C4436A] text-sm">{lastCreatedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-[#8C7480] block text-[10px] uppercase font-bold">Date</span>
              <strong className="text-[#2C2329]">{lastCreatedOrder.createdAt}</strong>
            </div>
            <div>
              <span className="text-[#8C7480] block text-[10px] uppercase font-bold">Payment Method</span>
              <strong className="text-[#2C2329] uppercase">{lastCreatedOrder.paymentMethod.replace('_', ' ')}</strong>
            </div>
            <div>
              <span className="text-[#8C7480] block text-[10px] uppercase font-bold">Tracking ID</span>
              <strong className="text-emerald-700 font-mono">{lastCreatedOrder.trackingNumber}</strong>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#3D2C35]">
              Items in Order
            </h4>
            <div className="space-y-2.5">
              {lastCreatedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#FBE6EF]">
                  <div className="flex items-center gap-3">
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border" />
                    <div>
                      <h5 className="font-bold text-xs text-[#2C2329]">{item.productName}</h5>
                      <span className="text-[11px] text-[#8A737F]">Qty: {item.quantity} {item.variantInfo ? `• ${item.variantInfo}` : ''}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-[#2C2329]">₹{(item.total || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FDE5EF] text-xs space-y-1.5 text-[#5D4A55]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{(lastCreatedOrder.subtotal || 0).toLocaleString()}</span>
            </div>
            {lastCreatedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({lastCreatedOrder.couponCode})</span>
                <span>-₹{(lastCreatedOrder.discount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{lastCreatedOrder.shippingFee === 0 ? 'FREE' : `₹${lastCreatedOrder.shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{lastCreatedOrder.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#2C2329] pt-2 border-t border-[#F8D5E3]">
              <span>Grand Total</span>
              <span className="text-[#C4436A] text-base">₹{lastCreatedOrder.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 rounded-2xl bg-white border border-[#FBE6EF] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#3D2C35] mb-1">
              <MapPin className="w-4 h-4 text-[#C4436A]" />
              <span>Delivering to</span>
            </div>
            <p className="font-semibold text-[#2C2329]">{lastCreatedOrder.shippingAddress.fullName}</p>
            <p className="text-[#6B5562]">{lastCreatedOrder.shippingAddress.addressLine1}</p>
            <p className="text-[#6B5562]">
              {lastCreatedOrder.shippingAddress.city}, {lastCreatedOrder.shippingAddress.state} - {lastCreatedOrder.shippingAddress.pincode}
            </p>
            <p className="text-[#6B5562]">Phone: {lastCreatedOrder.shippingAddress.phone}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 btn-tinkle-outline font-sans font-bold text-xs tracking-wider uppercase py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleViewInAccount}
              className="flex-1 btn-tinkle font-sans font-bold text-xs tracking-wider uppercase py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track in My Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
