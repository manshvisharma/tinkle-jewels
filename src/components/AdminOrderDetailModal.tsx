import React, { useState } from 'react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Printer,
  Mail,
  Send,
  Trash2,
  MapPin,
  Phone,
  User,
  CreditCard,
  Tag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminOrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onDeleteRequest: (order: Order) => void;
}

export const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  order,
  onClose,
  onDeleteRequest,
}) => {
  const { updateOrderStatus, updateOrderPaymentStatus, sendDirectCustomerEmail, approveManualPayment } = useStore();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [trackingInput, setTrackingInput] = useState(order?.trackingNumber || '');
  const [courierName, setCourierName] = useState('Delhivery Express');
  const [statusNote, setStatusNote] = useState('');
  const [customEmailSubject, setCustomEmailSubject] = useState('');
  const [customEmailBody, setCustomEmailBody] = useState('');
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState<string | null>(null);

  if (!order) return null;

  const handleCopyAddress = () => {
    const addr = order.shippingAddress;
    const text = `${order.customerName}\n${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}${addr.landmark ? '\nLandmark: ' + addr.landmark : ''}\n${addr.city}, ${addr.state} - ${addr.pincode}\nPhone: ${order.customerPhone}`;
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleStatusChange = (newStatus: Order['orderStatus']) => {
    updateOrderStatus(order.id, newStatus, statusNote || `Status changed to ${newStatus}`, trackingInput || order.trackingNumber);
    setStatusNote('');
    confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#38ef7d'] });
  };

  const handleUpdateTracking = () => {
    const note = `Dispatched via ${courierName}. Tracking: ${trackingInput}`;
    updateOrderStatus(order.id, 'shipped', note, trackingInput);
    setEmailSentAlert(`Shipping notification email sent to ${order.customerEmail}`);
    setTimeout(() => setEmailSentAlert(null), 4000);
    confetti({ particleCount: 35, spread: 50, colors: ['#C4436A', '#E5C158'] });
  };

  const handleSendCustomEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailSubject.trim() || !customEmailBody.trim()) return;
    sendDirectCustomerEmail(order.customerEmail, order.customerName, customEmailSubject.trim(), customEmailBody.trim());
    setEmailSentAlert(`Email successfully sent to ${order.customerEmail}`);
    setCustomEmailSubject('');
    setCustomEmailBody('');
    setShowEmailComposer(false);
    setTimeout(() => setEmailSentAlert(null), 4000);
    confetti({ particleCount: 25, spread: 40 });
  };

  const handleQuickEmailTemplate = (type: 'confirm' | 'shipped' | 'out_for_delivery' | 'delivered') => {
    if (type === 'confirm') {
      sendDirectCustomerEmail(
        order.customerEmail,
        order.customerName,
        `Order Confirmed: ${order.orderNumber} - Tinkle Jewels`,
        `Hi ${order.customerName},\n\nWe have received your order #${order.orderNumber} for ₹${order.grandTotal.toLocaleString()} and it is currently in preparation. Our artisans are inspecting your jewelry items.\n\nThank you for choosing Tinkle Jewels!`
      );
    } else if (type === 'shipped') {
      sendDirectCustomerEmail(
        order.customerEmail,
        order.customerName,
        `Your Tinkle Jewels Order ${order.orderNumber} is on the way!`,
        `Hi ${order.customerName},\n\nGreat news! Your package has been dispatched via ${courierName}.\nTracking ID: ${trackingInput || order.trackingNumber || 'TKL-EXP-992'}\nEstimated Delivery: 2-4 business days.\n\nEnjoy your sparkle!`
      );
    } else if (type === 'out_for_delivery') {
      sendDirectCustomerEmail(
        order.customerEmail,
        order.customerName,
        `Out for Delivery: Order ${order.orderNumber}`,
        `Hi ${order.customerName},\n\nYour package is out for delivery today. Please ensure someone is available at the delivery address to receive it.\n\nThank you!`
      );
    } else if (type === 'delivered') {
      sendDirectCustomerEmail(
        order.customerEmail,
        order.customerName,
        `Delivered: Order ${order.orderNumber} - We hope you love it!`,
        `Hi ${order.customerName},\n\nYour order #${order.orderNumber} has been delivered. We hope you adore your new pieces! Please feel free to leave a review or reach out if you need anything.\n\nWarm regards,\nTinkle Jewels Studio`
      );
    }
    setEmailSentAlert(`Email notification dispatched to ${order.customerEmail}`);
    setTimeout(() => setEmailSentAlert(null), 4000);
    confetti({ particleCount: 25, spread: 45 });
  };

  const statuses: { key: Order['orderStatus']; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-4xl w-full rounded-3xl p-5 sm:p-8 border border-[#FBE6EF] shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8C7582] hover:text-[#241A20] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Order Number & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7D8E4] pb-4 pr-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-xl sm:text-2xl text-[#C4436A]">
                {order.orderNumber}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.orderStatus === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.orderStatus === 'shipped' || order.orderStatus === 'out_for_delivery'
                    ? 'bg-sky-100 text-sky-800'
                    : order.orderStatus === 'cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {order.paymentStatus} ({order.paymentMethod})
              </span>
            </div>
            <p className="text-xs text-[#8C7582] mt-1">
              Placed on {order.createdAt} &bull; Order ID: <code className="font-mono text-[#5D4753]">{order.id}</code>
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-[#F0D5DF] text-xs font-semibold text-[#5D4753] hover:bg-[#FFF0F5] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => onDeleteRequest(order)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Order</span>
            </button>
          </div>
        </div>

        {/* Email Notification Alert Banner */}
        {emailSentAlert && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{emailSentAlert}</span>
          </div>
        )}

        {/* MANUAL PAYMENT APPROVAL CARD (When payment status is pending or manual payment proof exists) */}
        {(order.paymentStatus === 'pending' || order.paymentProofRef) && (
          <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span className="font-bold text-xs uppercase tracking-wider text-amber-950">
                  Manual Payment Verification Required (UPI / QR / Bank)
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                {order.paymentStatus === 'paid' ? 'Verified & Paid' : 'Awaiting Admin Approval'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-amber-200">
              <div>
                <span className="text-gray-500 block text-[11px]">Submitted UTR / Transaction Ref:</span>
                <strong className="font-mono text-sm text-[#241A20] font-extrabold">
                  {order.paymentProofRef || 'No UTR provided'}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Payment Method:</span>
                <strong className="text-[#241A20] uppercase font-bold">
                  {order.paymentMethod} &bull; ₹{order.grandTotal.toLocaleString()}
                </strong>
              </div>
            </div>

            {order.paymentStatus === 'pending' && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-amber-900 font-medium">
                  Review the 12-digit UTR in your bank statement. Click Approve to mark as paid and confirm order.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      updateOrderPaymentStatus(order.id, 'failed');
                      setEmailSentAlert(`Payment rejected for Order ${order.orderNumber}`);
                      setTimeout(() => setEmailSentAlert(null), 4000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      approveManualPayment(order.id, 'Admin');
                      setEmailSentAlert(`✨ Manual Payment Verified! Order ${order.orderNumber} confirmed & customer notified.`);
                      setTimeout(() => setEmailSentAlert(null), 5000);
                      confetti({ particleCount: 50, spread: 60, colors: ['#38ef7d', '#C4436A'] });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Payment &amp; Confirm Order</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Status Progression Bar */}
        <div className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C3A5A] uppercase tracking-wider">
              Order Fulfillment Workflow
            </span>
            <span className="text-xs text-[#8C7582]">
              Change status will automatically send email update to customer
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {statuses.map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => handleStatusChange(st.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  order.orderStatus === st.key
                    ? 'bg-[#C4436A] text-white shadow-xs scale-102'
                    : 'bg-white text-[#5D4753] border border-[#F0D5DF] hover:border-[#C4436A] hover:bg-[#FFF0F5]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Status Note Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add optional internal status note or remarks..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-[#F0D5DF] bg-white focus:outline-none focus:border-[#C4436A]"
            />
            <button
              onClick={() => handleStatusChange(order.orderStatus)}
              className="px-3 py-1.5 bg-[#FFF0F5] border border-[#F0D5DF] text-[#C4436A] text-xs font-bold rounded-xl hover:bg-[#C4436A] hover:text-white transition-colors cursor-pointer"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Shipping & Dispatch Tracking Box */}
        <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                Courier &amp; Tracking Dispatch
              </span>
            </div>
            {order.trackingNumber && (
              <span className="text-xs font-mono font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200">
                Active Tracking: {order.trackingNumber}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-4">
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-sky-200 bg-white font-medium text-sky-950"
              >
                <option value="Delhivery Express">Delhivery Express</option>
                <option value="Blue Dart Express">Blue Dart Express</option>
                <option value="DTDC Courier">DTDC Courier</option>
                <option value="India Post SpeedPost">India Post SpeedPost</option>
                <option value="Ekart Logistics">Ekart Logistics</option>
                <option value="Shadowfax">Shadowfax</option>
                <option value="FedEx Express">FedEx Express</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter AWB / Tracking ID (e.g. DEL-889921)"
                className="w-full text-xs p-2 rounded-xl border border-sky-200 bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleUpdateTracking}
                className="w-full h-full text-xs font-bold py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch &amp; Mail</span>
              </button>
            </div>
          </div>
        </div>

        {/* ORDERED ITEMS WITH PROMINENT VARIANT DETAILS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-[#241A20] flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#C4436A]" />
              <span>Ordered Products &amp; Chosen Variants ({(order.items || []).length} items)</span>
            </h4>
            <span className="text-xs text-[#8C7582]">All selected sizes, colors &amp; custom specifications</span>
          </div>

          <div className="border border-[#FCE1EB] rounded-2xl overflow-hidden divide-y divide-[#FCE1EB] bg-white">
            {(order.items || []).map((it, idx) => (
              <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF9FB] transition-colors">
                <div className="flex items-start gap-3">
                  <img
                    src={it.productImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80'}
                    alt={it.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-[#F7D8E4] shrink-0 shadow-2xs"
                  />
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs sm:text-sm text-[#241A20]">{it.productName}</h5>
                    
                    {/* EXPANDED VARIANT DETAILS BADGE */}
                    {it.variantInfo ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF0F5] border border-[#FAD2E2] rounded-lg text-xs font-semibold text-[#8C3A5A]">
                        <Tag className="w-3 h-3 text-[#C4436A]" />
                        <span>Chosen Variant: <strong className="text-[#C4436A]">{it.variantInfo}</strong></span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#8C7582] italic">Standard / Default Option</span>
                    )}

                    <div className="text-[11px] text-[#8C7582]">
                      Product ID: <code className="font-mono text-[#5D4753]">{it.productId}</code>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-[#FDE8EE] sm:pl-4">
                  <div className="text-xs font-bold text-[#C4436A]">
                    ₹{(it.price || 0).toLocaleString()} &times; {it.quantity}
                  </div>
                  <div className="text-sm font-extrabold text-[#241A20] mt-0.5">
                    = ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Grid: Customer/Shipping & Payment/Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Customer & Delivery Address Card */}
          <div className="p-4 bg-white rounded-2xl border border-[#FBE6EF] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F7D8E4] pb-2">
              <span className="font-bold text-xs text-[#241A20] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C4436A]" />
                <span>Shipping &amp; Customer Details</span>
              </span>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="text-[11px] font-semibold text-[#C4436A] hover:text-[#A83254] flex items-center gap-1 cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-[#5D4753]">
              <div className="font-bold text-[#241A20] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8C7582]" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B5563]">
                <Mail className="w-3.5 h-3.5 text-[#8C7582]" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B5563]">
                <Phone className="w-3.5 h-3.5 text-[#8C7582]" />
                <span>{order.customerPhone}</span>
              </div>

              <div className="pt-2 border-t border-[#FDE8EE] space-y-0.5">
                <span className="text-[10px] font-bold text-[#8C7582] uppercase block">Delivery Address:</span>
                <p className="font-medium text-[#241A20] leading-snug">
                  {order.shippingAddress?.addressLine1}
                  {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                {order.shippingAddress?.landmark && (
                  <p className="text-[11px] text-[#7A6370]">Landmark: {order.shippingAddress.landmark}</p>
                )}
                <p className="font-medium text-[#241A20]">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong className="text-[#C4436A]">{order.shippingAddress?.pincode}</strong>
                </p>
                <p className="text-[10px] text-[#8C7582]">{order.shippingAddress?.country || 'India'}</p>
              </div>
            </div>
          </div>

          {/* Payment & Invoice Summary Card */}
          <div className="p-4 bg-white rounded-2xl border border-[#FBE6EF] space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F7D8E4] pb-2">
              <span className="font-bold text-xs text-[#241A20] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#C4436A]" />
                <span>Payment &amp; Invoice Breakdown</span>
              </span>
              <select
                value={order.paymentStatus}
                onChange={(e) => updateOrderPaymentStatus(order.id, e.target.value as any)}
                className="text-[11px] p-1 rounded-lg border border-[#F0D5DF] font-bold bg-white text-[#8C3A5A]"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B5563]">
                <span>Items Subtotal:</span>
                <span>₹{(order.subtotal || 0).toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}:</span>
                  <span>-₹{(order.discount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B5563]">
                <span>Shipping Charges:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-[#6B5563]">
                  <span>GST / Tax:</span>
                  <span>₹{order.tax}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#FDE8EE] flex justify-between items-baseline font-bold text-base">
                <span className="text-[#241A20]">Grand Total:</span>
                <span className="text-[#C4436A] text-lg font-display">₹{(order.grandTotal || 0).toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-[#8C7582] pt-1">
                Payment Method: <strong className="uppercase text-[#241A20]">{order.paymentMethod}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Email Trigger Bar */}
        <div className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C4436A]" />
              <span className="text-xs font-bold text-[#8C3A5A] uppercase tracking-wider">
                Direct Customer Email Updates
              </span>
            </div>
            <button
              onClick={() => setShowEmailComposer(!showEmailComposer)}
              className="text-xs font-bold text-[#C4436A] hover:underline cursor-pointer"
            >
              {showEmailComposer ? 'Close Composer' : '+ Write Custom Email'}
            </button>
          </div>

          {/* Quick Pre-Set Template Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickEmailTemplate('confirm')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F0D5DF] hover:border-[#C4436A] text-xs font-semibold text-[#5D4753] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
            >
              ✉️ Send Order Confirmed Mail
            </button>
            <button
              type="button"
              onClick={() => handleQuickEmailTemplate('shipped')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F0D5DF] hover:border-[#C4436A] text-xs font-semibold text-[#5D4753] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
            >
              📦 Send Shipped &amp; Tracking Mail
            </button>
            <button
              type="button"
              onClick={() => handleQuickEmailTemplate('out_for_delivery')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F0D5DF] hover:border-[#C4436A] text-xs font-semibold text-[#5D4753] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
            >
              🚚 Send Out For Delivery Mail
            </button>
            <button
              type="button"
              onClick={() => handleQuickEmailTemplate('delivered')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F0D5DF] hover:border-[#C4436A] text-xs font-semibold text-[#5D4753] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
            >
              ✨ Send Delivery Completed Mail
            </button>
          </div>

          {/* Custom Email Composer */}
          {showEmailComposer && (
            <form onSubmit={handleSendCustomEmail} className="pt-2 border-t border-[#F8D8E4] space-y-2.5">
              <input
                type="text"
                placeholder="Email Subject Line"
                value={customEmailSubject}
                onChange={(e) => setCustomEmailSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#F0D5DF] bg-white font-semibold"
                required
              />
              <textarea
                rows={3}
                placeholder={`Write message to ${order.customerName}...`}
                value={customEmailBody}
                onChange={(e) => setCustomEmailBody(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#F0D5DF] bg-white"
                required
              />
              <button
                type="submit"
                className="btn-tinkle text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Email to {order.customerEmail}</span>
              </button>
            </form>
          )}
        </div>

        {/* Timeline Log */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#F7D8E4]">
            <span className="text-xs font-bold text-[#8C3A5A] uppercase tracking-wider block">
              Order Activity &amp; Status Log
            </span>
            <div className="space-y-1.5">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] p-2 bg-[#FFF9FB] rounded-xl border border-[#FCE1EB]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C4436A]" />
                    <strong className="text-[#241A20] uppercase">{h.status.replace(/_/g, ' ')}</strong>
                    <span className="text-[#6B5563]">&bull; {h.note}</span>
                  </div>
                  <span className="text-[#8C7582]">{h.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
