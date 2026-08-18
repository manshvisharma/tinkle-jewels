import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import {
  User,
  ShoppingBag,
  MapPin,
  HelpCircle,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Plus,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  Send,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerAccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    orders,
    customers,
    setCustomers,
    tickets,
    createTicket,
    settings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'support'>('orders');

  // Customer Profile State (Defaults to Ananya Sharma)
  const currentCustomer = customers[0] || {
    id: 'usr_1',
    name: 'Ananya Sharma',
    username: 'ananya_s',
    email: 'ananya.sharma@example.com',
    phone: '+91 98201 44512',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2025-11-12',
    totalOrders: 6,
    totalSpent: 5890,
    isRepeatCustomer: true,
    addresses: [],
  };

  const [profileName, setProfileName] = useState(currentCustomer?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentCustomer?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentCustomer?.phone || '');

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // OTP Verification State (if required in store settings)
  const [generatedOtp, setGeneratedOtp] = useState<string>('849201');
  const [otpInput, setOtpInput] = useState('');
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(currentCustomer?.isEmailVerified || false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentCustomer.id ? { ...c, password: newPass } : c))
    );
    setPassMsg({ type: 'success', text: '✨ Password updated successfully!' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#38ef7d'] });
  };

  const handleSendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpMsg(`🔑 OTP Code sent to ${profileEmail}: ${code}`);
    confetti({ particleCount: 15, spread: 30 });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === generatedOtp.trim()) {
      setIsOtpVerified(true);
      setCustomers((prev) =>
        prev.map((c) => (c.id === currentCustomer.id ? { ...c, isEmailVerified: true } : c))
      );
      setOtpMsg('✅ Email address verified successfully with OTP!');
      confetti({ particleCount: 40, spread: 60, colors: ['#38ef7d', '#C4436A'] });
    } else {
      setOtpMsg('❌ Invalid OTP Code. Please enter the exact 6-digit PIN sent to your email.');
    }
  };

  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    fullName: currentCustomer?.name || '',
    phone: currentCustomer?.phone || '',
    email: currentCustomer?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400050',
    type: 'home',
    isDefault: true,
  });

  // Orders Filter States (Last 6 months, status filter)
  const [orderTimeframe, setOrderTimeframe] = useState<'30_days' | '6_months' | 'all'>('6_months');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  if (!isAccountOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === currentCustomer.id
          ? { ...c, name: profileName, email: profileEmail, phone: profilePhone }
          : c
      )
    );
    confetti({ particleCount: 25, spread: 45, colors: ['#C4436A', '#F38BA0'] });
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addr: Address = {
      ...newAddress,
      id: 'addr_' + Date.now(),
    };
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentCustomer.id ? { ...c, addresses: [...c.addresses, addr] } : c))
    );
    setIsAddingAddress(false);
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    createTicket({
      ticketNumber: `TKL-SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentCustomer.name,
      customerEmail: currentCustomer.email,
      subject: ticketSubject,
      message: ticketMessage,
      status: 'pending',
    });
    setTicketSubject('');
    setTicketMessage('');
    confetti({ particleCount: 35, spread: 50, colors: ['#C4436A', '#38ef7d'] });
  };

  // Filter user's orders
  const userOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white max-w-4xl w-full rounded-3xl border border-[#FBE6EF] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Mobile Header with User info & Tabs */}
        <div className="md:hidden bg-[#FFF9FB] border-b border-[#F7D8E4] p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <img
                src={currentCustomer.avatar}
                alt={currentCustomer.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#F7D8E4]"
              />
              <div>
                <h3 className="font-display font-bold text-sm text-[#241A20]">{currentCustomer.name}</h3>
                <span className="text-[10px] text-[#C4436A] font-bold">VIP Member ✨</span>
              </div>
            </div>
            <button
              onClick={() => setIsAccountOpen(false)}
              className="p-1.5 text-[#8C7582] hover:text-black rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Horizontal Scrollable Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'orders' ? 'bg-[#C4436A] text-white shadow-xs' : 'bg-white text-[#7A6370] border border-[#FCE1EB]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({userOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'addresses' ? 'bg-[#C4436A] text-white shadow-xs' : 'bg-white text-[#7A6370] border border-[#FCE1EB]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Addresses</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'profile' ? 'bg-[#C4436A] text-white shadow-xs' : 'bg-white text-[#7A6370] border border-[#FCE1EB]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'support' ? 'bg-[#C4436A] text-white shadow-xs' : 'bg-white text-[#7A6370] border border-[#FCE1EB]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Helpdesk</span>
            </button>
          </div>
        </div>

        {/* Desktop User Sidebar */}
        <div className="hidden md:flex w-72 bg-[#FFF9FB] border-r border-[#F7D8E4] p-6 flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-3.5">
              <img
                src={currentCustomer.avatar}
                alt={currentCustomer.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F7D8E4] shadow-xs"
              />
              <div>
                <h3 className="font-display font-bold text-base text-[#241A20]">{currentCustomer.name}</h3>
                <span className="text-[11px] text-[#C4436A] font-bold bg-[#FFF0F5] px-2 py-0.5 rounded-full block w-fit mt-0.5">
                  VIP Club Member ✨
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 text-center p-3 bg-white rounded-2xl border border-[#F7D8E4]">
              <div>
                <span className="text-[10px] text-[#8C7582] block">Total Orders</span>
                <strong className="text-base text-[#241A20]">{userOrders.length}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8C7582] block">Tinkle Coins</span>
                <strong className="text-base text-[#C4436A]">450 🪙</strong>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-[#C4436A] text-white shadow-md' : 'text-[#7A6370] hover:bg-[#FFF0F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{userOrders.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'addresses' ? 'bg-[#C4436A] text-white shadow-md' : 'text-[#7A6370] hover:bg-[#FFF0F5]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-[#C4436A] text-white shadow-md' : 'text-[#7A6370] hover:bg-[#FFF0F5]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'support' ? 'bg-[#C4436A] text-white shadow-md' : 'text-[#7A6370] hover:bg-[#FFF0F5]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Helpdesk &amp; Queries</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#F7D8E4] text-[11px] text-[#8C7582] text-center">
            Logged in as <strong>{currentCustomer.email}</strong>
          </div>
        </div>

        {/* User Content Pane */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* Header */}
          <div className="hidden md:flex items-center justify-between border-b border-[#F7D8E4] pb-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-[#241A20]">
                {activeTab === 'orders' && 'Order History & Real-Time Tracking'}
                {activeTab === 'addresses' && 'Manage Delivery Addresses'}
                {activeTab === 'profile' && 'Personal Information'}
                {activeTab === 'support' && 'Support & Direct Inquiry'}
              </h2>
              <p className="text-xs text-[#7A6370] mt-0.5">
                {activeTab === 'orders' && 'Track packages, download tax invoices, and request returns.'}
                {activeTab === 'addresses' && 'Add multiple delivery addresses for seamless 1-click checkout.'}
                {activeTab === 'profile' && 'Update your name, email, phone number and login credentials.'}
                {activeTab === 'support' && 'Direct inquiry ticket to our studio team.'}
              </p>
            </div>

            <button
              onClick={() => setIsAccountOpen(false)}
              className="p-2 text-[#8C7582] hover:text-black rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB 1: ORDERS WITH FILTERS (Last 6 months, status) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Order Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] text-xs">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#C4436A]" />
                  <span className="font-bold text-[#8C3A5A]">Filter By:</span>
                  
                  <select
                    value={orderTimeframe}
                    onChange={(e) => setOrderTimeframe(e.target.value as any)}
                    className="p-1.5 rounded-lg border border-[#F5D0DF] bg-white text-[#241A20] font-medium"
                  >
                    <option value="30_days">Last 30 Days</option>
                    <option value="6_months">Last 6 Months</option>
                    <option value="all">All Orders (2025-2026)</option>
                  </select>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-1.5 rounded-lg border border-[#F5D0DF] bg-white text-[#241A20] font-medium capitalize"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <span className="text-[11px] text-[#7A6370]">
                  Showing {userOrders.length} orders
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-4">
                {userOrders.map((ord) => (
                  <div key={ord.id} className="p-5 bg-white rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FDF0F5] pb-3 text-xs">
                      <div>
                        <strong className="text-sm font-mono text-[#C4436A] block">{ord.orderNumber}</strong>
                        <span className="text-[10px] text-[#8C7582]">Placed on {ord.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          ord.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-sm text-[#241A20]">₹{(ord.grandTotal || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-[#F7D8E4]" />
                            <div>
                              <strong className="text-xs text-[#241A20] block">{item.productName}</strong>
                              <span className="text-[10px] text-[#8C7582]">{item.variantInfo} &bull; Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-xs text-[#C4436A]">₹{(item.total || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live Tracking Progress Timeline */}
                    <div className="p-3 bg-[#FFF9FB] rounded-2xl border border-[#FCE1EB] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#8C3A5A] flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#C4436A]" />
                          <span>Delivery Courier: BlueDart Express</span>
                        </span>
                        {ord.trackingNumber && (
                          <span className="font-mono text-[10px] text-[#7A6370]">AWB: {ord.trackingNumber}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#7A6370] pt-1">
                        <span className="font-bold text-emerald-700">✓ Order Placed</span>
                        <span className="font-bold text-emerald-700">✓ Packed</span>
                        <span className={`font-bold ${ord.orderStatus === 'shipped' || ord.orderStatus === 'delivered' ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {ord.orderStatus === 'shipped' || ord.orderStatus === 'delivered' ? '✓ In Transit' : '○ Dispatching'}
                        </span>
                        <span className={`font-bold ${ord.orderStatus === 'delivered' ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {ord.orderStatus === 'delivered' ? '✓ Delivered' : '○ Out For Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A6370]">Saved shipping and billing destinations</span>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="btn-tinkle text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddressSubmit} className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#F5B8CE] space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-[#8C3A5A]">New Delivery Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full p-2 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full p-2 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Flat / House No / Street Address *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full p-2 rounded-xl border border-[#F5D0DF] bg-white"
                      placeholder="e.g. Flat 402, Sea Breeze Apts, Linking Road"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full p-2 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full p-2 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full p-2 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="btn-tinkle px-4 py-2 rounded-xl font-bold cursor-pointer">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border-2 border-[#C4436A] shadow-xs space-y-2 text-xs relative">
                  <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#FFF0F5] text-[#C4436A] px-2 py-0.5 rounded-full border border-[#F5D0DF]">
                    Default Home
                  </span>
                  <h4 className="font-bold text-sm text-[#241A20]">{currentCustomer.name}</h4>
                  <p className="text-[#7A6370]">Flat 402, Sea Breeze Apts, Worli Seaface</p>
                  <p className="text-[#7A6370]">Mumbai, Maharashtra - 400018</p>
                  <p className="text-[11px] text-[#8C7582]">Phone: {currentCustomer.phone}</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#FBE6EF] shadow-xs space-y-2 text-xs relative">
                  <span className="absolute top-4 right-4 text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    Studio Work
                  </span>
                  <h4 className="font-bold text-sm text-[#241A20]">{currentCustomer.name}</h4>
                  <p className="text-[#7A6370]">Lotus Galleria, 4th Floor, Linking Road</p>
                  <p className="text-[#7A6370]">Bandra West, Mumbai - 400050</p>
                  <p className="text-[11px] text-[#8C7582]">Phone: {currentCustomer.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl text-xs">
              
              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="p-5 bg-white rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#241A20] border-b border-[#FCE1EB] pb-2">
                  Personal Information
                </h3>

                <div>
                  <label className="font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Email Address</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                    {isOtpVerified ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-xl shrink-0">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1.5 rounded-xl shrink-0">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <button type="submit" className="btn-tinkle py-2.5 px-6 rounded-xl font-bold cursor-pointer">
                  Save Profile Changes
                </button>
              </form>

              {/* OTP Verification Section (When enabled in store settings or required) */}
              {(settings.requireEmailOtpVerification || !isOtpVerified) && (
                <div className="p-5 bg-[#FFF9FB] rounded-3xl border border-[#FBE6EF] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#8C3A5A]">Email OTP Verification</h4>
                      <p className="text-[11px] text-[#7A6370]">
                        {settings.requireEmailOtpVerification
                          ? 'Store policy requires email OTP verification for secure login & orders.'
                          : 'Verify your email to receive real-time SMS & order confirmation updates.'}
                      </p>
                    </div>
                    {isOtpVerified && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        ✅ Verified
                      </span>
                    )}
                  </div>

                  {!isOtpVerified && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="flex-1 p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono tracking-widest text-center text-sm font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-4 py-2.5 bg-[#FFF0F5] border border-[#F5D0DF] text-[#C4436A] hover:bg-[#C4436A] hover:text-white rounded-xl font-bold transition-all cursor-pointer text-xs"
                        >
                          Send OTP
                        </button>
                        <button
                          type="submit"
                          className="btn-tinkle px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                        >
                          Verify OTP
                        </button>
                      </div>

                      {otpMsg && (
                        <div className={`p-3 rounded-xl text-xs font-semibold ${
                          otpMsg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {otpMsg}
                        </div>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* Password Change Form */}
              <form onSubmit={handlePasswordChange} className="p-5 bg-white rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#241A20] border-b border-[#FCE1EB] pb-2">
                  Security &amp; Change Password
                </h3>

                {passMsg && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${
                    passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {passMsg.text}
                  </div>
                )}

                <div>
                  <label className="font-bold block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-tinkle py-2.5 px-6 rounded-xl font-bold cursor-pointer">
                  Update Password
                </button>
              </form>

            </div>
          )}

          {/* TAB 4: SUPPORT HELPDESK */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateTicketSubmit} className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-3 text-xs">
                <h4 className="font-bold text-sm text-[#8C3A5A]">Ask a Question or Request Help</h4>
                <div>
                  <label className="font-semibold block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Need help with ring sizing or custom engraving"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Your Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your inquiry..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                  />
                </div>

                <button type="submit" className="btn-tinkle py-2.5 px-5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry to Studio</span>
                </button>
              </form>

              {/* Prior Queries History */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-[#241A20]">My Inquiries &amp; Answers</h4>
                {tickets.map((tkt) => (
                  <div key={tkt.id} className="p-4 bg-white rounded-2xl border border-[#FBE6EF] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#C4436A]">{tkt.subject}</strong>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        tkt.status === 'solved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>

                    <p className="text-[#7A6370]">{tkt.message}</p>

                    {tkt.replies && tkt.replies.length > 1 && (
                      <div className="p-3 bg-[#FFF0F5] rounded-xl border border-[#FCE1EB] text-[11px] text-[#8C3A5A]">
                        <strong>Studio Reply: </strong>
                        {tkt.replies[tkt.replies.length - 1].message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
