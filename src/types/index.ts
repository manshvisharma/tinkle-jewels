export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  isHover?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: {
    size?: string;
    color?: string;
    hex?: string;
    material?: string;
    type?: string;
  };
  price: number;
  salePrice?: number;
  stock: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subCategory?: string;
  nestedSubCategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  highlights?: string[];
  careInstructions?: string;
  primaryImage: string;
  hoverImage?: string;
  galleryImages: string[];
  badges?: ('NEW' | 'BEST SELLER' | 'SALE' | 'CUSTOM' | 'TRENDING' | 'LIMITED')[];
  variants?: ProductVariant[];
  colors?: { name: string; hex: string; image?: string; price?: number }[];
  sizes?: string[];
  inStock: boolean;
  stockCount: number;
  tags: string[];
  material?: string;
  isCustomizable?: boolean;
  sizeChart?: {
    columns: string[];
    rows: { [key: string]: string }[];
  };
}

export interface NestedSubcategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image?: string;
  nestedSubcategories?: NestedSubcategory[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  itemCount: number;
  subcategories: Subcategory[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  selectedColor?: string;
  selectedSize?: string;
  customNote?: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
  usageCount: number;
  maxUsage: number;
  perUserLimit?: number;
  isActive?: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantInfo?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderStatusHistory {
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'manual_demo' | 'upi_qr' | 'bank_transfer' | 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  statusHistory: OrderStatusHistory[];
  trackingNumber?: string;
  courierName?: string;
  paymentProofRef?: string;
  paymentApprovedAt?: string;
  paymentApprovedBy?: string;
  paymentRejectionReason?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  images?: string[];
}

export interface CustomerUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  password?: string;
  isEmailVerified?: boolean;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isRepeatCustomer: boolean;
  addresses: Address[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  subject: string;
  message: string;
  status: 'pending' | 'solved';
  createdAt: string;
  replies?: {
    id: string;
    sender: 'customer' | 'admin';
    message: string;
    timestamp: string;
  }[];
}

export interface EmailBroadcast {
  id: string;
  subject: string;
  content: string;
  recipientType: 'all_users' | 'repeat_buyers' | 'newsletter_only';
  sentAt: string;
  recipientCount: number;
}

export interface PaymentGatewaySettings {
  manualUpi: {
    enabled: boolean;
    upiId: string;
    payeeName: string;
    qrCodeUrl: string;
    instructions: string;
    accountName?: string;
    bankName?: string;
    qrCodeText?: string;
  };
  cod: {
    enabled: boolean;
    extraCharge: number;
    minOrderLimit: number;
    maxOrderLimit: number;
  };
  bankTransfer: {
    enabled: boolean;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
  razorpay: {
    enabled: boolean;
    keyId: string;
    keySecret: string;
    testMode: boolean;
  };
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
    testMode: boolean;
  };
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  contactEmail: string;
  forwardingEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  whatsappEnabled: boolean;
  address: string;
  instagramHandle: string;
  announcementText: string;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  requireEmailOtpVerification?: boolean;
  adminPassword?: string;
  taxRate: number; // percentage
  fakeRatingsEnabled: boolean;
  fakeRatingBase: number;
  fakeRatingCountBoost: number;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromEmail: string;
    fromName: string;
  };
}
