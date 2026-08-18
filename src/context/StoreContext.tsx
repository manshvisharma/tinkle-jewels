import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Address,
  CartItem,
  Category,
  Subcategory,
  NestedSubcategory,
  Coupon,
  Order,
  Product,
  Review,
  StoreSettings,
  CustomerUser,
  SupportTicket,
  EmailBroadcast,
  PaymentGatewaySettings,
} from '../types';
import {
  CATEGORIES,
  COUPONS,
  INITIAL_SETTINGS,
  INITIAL_PAYMENT_GATEWAYS,
  PRODUCTS,
  REVIEWS,
  SAMPLE_CUSTOMERS,
  SAMPLE_TICKETS,
  SAMPLE_BROADCASTS,
} from '../data/catalog';

interface StoreContextType {
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, sub: Subcategory) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, updated: Partial<Subcategory>) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  addNestedSubcategory: (categoryId: string, subcategoryId: string, nested: NestedSubcategory) => void;
  updateNestedSubcategory: (categoryId: string, subcategoryId: string, nestedId: string, updated: Partial<NestedSubcategory>) => void;
  deleteNestedSubcategory: (categoryId: string, subcategoryId: string, nestedId: string) => void;

  customers: CustomerUser[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerUser[]>>;
  sendDirectCustomerEmail: (customerEmail: string, customerName: string, subject: string, message: string) => void;
  
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  updateTicketStatus: (ticketId: string, status: 'pending' | 'solved') => void;
  replyToTicket: (ticketId: string, message: string) => void;
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;

  broadcasts: EmailBroadcast[];
  sendEmailBroadcast: (subject: string, content: string, recipientType: EmailBroadcast['recipientType']) => void;

  paymentGateways: PaymentGatewaySettings;
  setPaymentGateways: React.Dispatch<React.SetStateAction<PaymentGatewaySettings>>;
  updatePaymentGateways: (updated: Partial<PaymentGatewaySettings>) => void;

  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  appliedCoupon: Coupon | null;
  
  activeView: 'home' | 'storefront' | 'shop' | 'admin' | 'installer' | 'php-source';
  setActiveView: (view: 'home' | 'storefront' | 'shop' | 'admin' | 'installer' | 'php-source') => void;
  
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (sub: string | null) => void;
  selectedNestedSubcategory: string | null;
  setSelectedNestedSubcategory: (nested: string | null) => void;
  
  budgetFilter: string | null;
  setBudgetFilter: (budget: string | null) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  
  lastCreatedOrder: Order | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string, customNote?: string, variant?: any) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Order Actions
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: 'manual_demo' | 'upi_qr' | 'bank_transfer' | 'razorpay' | 'cod';
    paymentProofRef?: string;
  }) => Order;
  approveManualPayment: (orderId: string, note?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], note?: string, trackingNumber?: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string, courierName?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Product & Admin Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Cart Calculations
  cartSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  cartGrandTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('tinkle_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewaySettings>(() => {
    const saved = localStorage.getItem('tinkle_payment_gateways');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_GATEWAYS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tinkle_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('tinkle_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('tinkle_customers');
    return saved ? JSON.parse(saved) : SAMPLE_CUSTOMERS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('tinkle_tickets');
    return saved ? JSON.parse(saved) : SAMPLE_TICKETS;
  });

  const [broadcasts, setBroadcasts] = useState<EmailBroadcast[]>(() => {
    const saved = localStorage.getItem('tinkle_broadcasts');
    return saved ? JSON.parse(saved) : SAMPLE_BROADCASTS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('tinkle_coupons');
    return saved ? JSON.parse(saved) : COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('tinkle_reviews');
    return saved ? JSON.parse(saved) : REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tinkle_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('tinkle_wishlist');
    return saved ? JSON.parse(saved) : ['prod_1', 'prod_3'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tinkle_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord_1001',
        orderNumber: 'TKL-8921',
        customerName: 'Ananya Sharma',
        customerEmail: 'ananya.s@example.com',
        customerPhone: '+91 98765 12340',
        items: [
          {
            productId: 'prod_1',
            productName: 'Dainty Heart Solitaire Pendant',
            productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
            variantInfo: '18k Warm Gold / 16 inch',
            price: 799,
            quantity: 1,
            total: 799,
          },
        ],
        subtotal: 799,
        discount: 160,
        couponCode: 'TINKLE20',
        shippingFee: 99,
        tax: 22,
        grandTotal: 760,
        shippingAddress: {
          id: 'addr_1',
          fullName: 'Ananya Sharma',
          phone: '+91 98765 12340',
          email: 'ananya.s@example.com',
          addressLine1: 'Flat 402, Sea Breeze Apts, Worli Seaface',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400018',
          type: 'home',
          isDefault: true,
        },
        billingAddress: {
          id: 'addr_1',
          fullName: 'Ananya Sharma',
          phone: '+91 98765 12340',
          email: 'ananya.s@example.com',
          addressLine1: 'Flat 402, Sea Breeze Apts, Worli Seaface',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400018',
          type: 'home',
        },
        paymentMethod: 'upi_qr',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        trackingNumber: 'BLUEDART-8492019482',
        statusHistory: [
          { status: 'pending', timestamp: '2026-08-16 10:14', note: 'Order placed by customer via UPI QR', updatedBy: 'System' },
          { status: 'confirmed', timestamp: '2026-08-16 10:30', note: 'Payment verified and order confirmed', updatedBy: 'Admin' },
          { status: 'shipped', timestamp: '2026-08-17 14:00', note: 'Dispatched via BlueDart Express (AWB: 8492019482)', updatedBy: 'Warehouse' },
        ],
        createdAt: '2026-08-16 10:14',
      },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'storefront' | 'shop' | 'admin' | 'installer' | 'php-source'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedNestedSubcategory, setSelectedNestedSubcategory] = useState<string | null>(null);
  
  const [budgetFilter, setBudgetFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('trending');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist State
  useEffect(() => {
    localStorage.setItem('tinkle_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tinkle_payment_gateways', JSON.stringify(paymentGateways));
  }, [paymentGateways]);

  useEffect(() => {
    localStorage.setItem('tinkle_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tinkle_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tinkle_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('tinkle_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('tinkle_broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  useEffect(() => {
    localStorage.setItem('tinkle_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('tinkle_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('tinkle_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tinkle_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('tinkle_orders', JSON.stringify(orders));
  }, [orders]);

  const activeCategories = categories.filter((c) => c.isActive !== false);
  const activeProducts = products.filter((p) => p.isActive !== false && activeCategories.some((c) => c.slug === p.category || c.id === p.category));

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updatePaymentGateways = (updated: Partial<PaymentGatewaySettings>) => {
    setPaymentGateways((prev) => ({ ...prev, ...updated }));
  };

  // Category Tree Actions
  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addSubcategory = (categoryId: string, sub: Subcategory) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, sub],
            itemCount: cat.itemCount + (sub.itemCount || 0),
          };
        }
        return cat;
      })
    );
  };

  const updateSubcategory = (categoryId: string, subcategoryId: string, updated: Partial<Subcategory>) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedSubs = cat.subcategories.map((sub) =>
            sub.id === subcategoryId ? { ...sub, ...updated } : sub
          );
          return { ...cat, subcategories: updatedSubs };
        }
        return cat;
      })
    );
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((s) => s.id !== subcategoryId),
          };
        }
        return cat;
      })
    );
  };

  const addNestedSubcategory = (categoryId: string, subcategoryId: string, nested: NestedSubcategory) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedSubs = cat.subcategories.map((sub) => {
            if (sub.id === subcategoryId) {
              const currentNested = sub.nestedSubcategories || [];
              return {
                ...sub,
                nestedSubcategories: [...currentNested, nested],
                itemCount: sub.itemCount + (nested.itemCount || 0),
              };
            }
            return sub;
          });
          return { ...cat, subcategories: updatedSubs };
        }
        return cat;
      })
    );
  };

  const updateNestedSubcategory = (
    categoryId: string,
    subcategoryId: string,
    nestedId: string,
    updated: Partial<NestedSubcategory>
  ) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedSubs = cat.subcategories.map((sub) => {
            if (sub.id === subcategoryId && sub.nestedSubcategories) {
              const updatedNested = sub.nestedSubcategories.map((nest) =>
                nest.id === nestedId ? { ...nest, ...updated } : nest
              );
              return { ...sub, nestedSubcategories: updatedNested };
            }
            return sub;
          });
          return { ...cat, subcategories: updatedSubs };
        }
        return cat;
      })
    );
  };

  const deleteNestedSubcategory = (categoryId: string, subcategoryId: string, nestedId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedSubs = cat.subcategories.map((sub) => {
            if (sub.id === subcategoryId && sub.nestedSubcategories) {
              return {
                ...sub,
                nestedSubcategories: sub.nestedSubcategories.filter((n) => n.id !== nestedId),
              };
            }
            return sub;
          });
          return { ...cat, subcategories: updatedSubs };
        }
        return cat;
      })
    );
  };

  // Direct Customer Email
  const sendDirectCustomerEmail = (customerEmail: string, customerName: string, subject: string, message: string) => {
    const newBroadcast: EmailBroadcast = {
      id: 'eml_' + Date.now(),
      subject,
      content: `[Direct to ${customerName} (${customerEmail})]: ${message}`,
      recipientType: 'repeat_buyers',
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      recipientCount: 1,
    };
    setBroadcasts((prev) => [newBroadcast, ...prev]);
  };

  // Support Tickets
  const updateTicketStatus = (ticketId: string, status: 'pending' | 'solved') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const replyToTicket = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const replies = t.replies || [];
          return {
            ...t,
            replies: [
              ...replies,
              {
                id: 'rep_' + Date.now(),
                sender: 'admin',
                message,
                timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const createTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => {
    const newTkt: SupportTicket = {
      ...ticket,
      id: 'tkt_' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      replies: [
        {
          id: 'rep_init',
          sender: 'customer',
          message: ticket.message,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        },
      ],
    };
    setTickets((prev) => [newTkt, ...prev]);
  };

  // Email Broadcasts
  const sendEmailBroadcast = (subject: string, content: string, recipientType: EmailBroadcast['recipientType']) => {
    const count = recipientType === 'repeat_buyers' ? customers.filter((c) => c.isRepeatCustomer).length : customers.length;
    const newBroadcast: EmailBroadcast = {
      id: 'bc_' + Date.now(),
      subject,
      content,
      recipientType,
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      recipientCount: count || 250,
    };
    setBroadcasts((prev) => [newBroadcast, ...prev]);
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: 'rev_' + Date.now(),
      date: 'Just now',
    };
    setReviews((prev) => [newRev, ...prev]);
    // update product review count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === review.productId) {
          const newCount = p.reviewCount + 1;
          const newRating = Number(((p.rating * p.reviewCount + review.rating) / newCount).toFixed(1));
          return { ...p, reviewCount: newCount, rating: newRating };
        }
        return p;
      })
    );
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const shippingFee = cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0 ? 0 : settings.defaultShippingFee;
  const taxAmount = Math.round(((cartSubtotal - discountAmount) * (settings.taxRate || 0)) / 100);
  const cartGrandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + taxAmount);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Actions
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string,
    customNote?: string,
    variant?: any
  ) => {
    const variantId = variant ? variant.id : `${selectedColor || ''}-${selectedSize || ''}`;
    const cartItemId = `${product.id}-${variantId}`;
    const priceToUse = variant ? variant.price : product.price;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedVariant: variant,
          selectedColor: selectedColor || (product.colors?.[0]?.name),
          selectedSize: selectedSize || (Array.isArray(product.sizes) ? product.sizes[0] : undefined),
          customNote,
          quantity,
          price: priceToUse,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && (c.isActive !== false));
    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Coupon requires a minimum cart value of ${settings.currencySymbol}${found.minOrderValue}`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Yay! Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: 'manual_demo' | 'upi_qr' | 'bank_transfer' | 'razorpay' | 'cod';
    paymentProofRef?: string;
  }): Order => {
    const isManualPayment = ['manual_demo', 'upi_qr', 'bank_transfer'].includes(orderData.paymentMethod);
    const initialPaymentStatus: Order['paymentStatus'] = isManualPayment ? 'pending' : (orderData.paymentMethod === 'cod' ? 'pending' : 'paid');
    const initialOrderStatus: Order['orderStatus'] = isManualPayment ? 'pending' : 'confirmed';

    const newOrderNumber = `TKL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: newOrderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.selectedVariant?.images?.[0] || item.product.primaryImage,
        variantInfo: [item.selectedVariant?.name, item.selectedColor, item.selectedSize].filter(Boolean).join(' / '),
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee,
      tax: taxAmount,
      grandTotal: cartGrandTotal,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      paymentProofRef: orderData.paymentProofRef,
      statusHistory: [
        {
          status: initialOrderStatus,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          note: isManualPayment
            ? `Manual Payment Submitted (Ref/UTR: ${orderData.paymentProofRef || 'Pending'}). Awaiting Admin Approval.`
            : `Order received via ${orderData.paymentMethod.toUpperCase()}`,
          updatedBy: 'System',
        },
      ],
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);

    // Send order confirmation email
    const emailSubject = isManualPayment
      ? `Payment Received - Order Pending Verification: ${newOrder.orderNumber}`
      : `Order Confirmed: ${newOrder.orderNumber}`;

    const emailBody = isManualPayment
      ? `Thank you for your order! We received your manual payment details (UTR/Ref: ${orderData.paymentProofRef || 'N/A'}). Our team will verify and confirm your order shortly. Total: ₹${newOrder.grandTotal.toLocaleString()}`
      : `Thank you for placing your order! We have received it and it is now being processed. Total: ₹${newOrder.grandTotal.toLocaleString()}`;

    sendDirectCustomerEmail(
      newOrder.customerEmail,
      newOrder.customerName,
      emailSubject,
      emailBody
    );

    return newOrder;
  };

  const approveManualPayment = (orderId: string, note?: string) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((order) => {
        if (order.id === orderId) {
          const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
          const newHistory = [
            ...order.statusHistory,
            {
              status: 'confirmed' as const,
              timestamp,
              note: note || `Manual payment verified & approved by Admin.`,
              updatedBy: 'Admin',
            },
          ];
          return {
            ...order,
            paymentStatus: 'paid' as const,
            orderStatus: 'confirmed' as const,
            paymentApprovedAt: timestamp,
            paymentApprovedBy: 'Admin',
            statusHistory: newHistory,
          };
        }
        return order;
      });

      const updated = updatedOrders.find((o) => o.id === orderId);
      if (updated) {
        sendDirectCustomerEmail(
          updated.customerEmail,
          updated.customerName,
          `Payment Verified & Order Confirmed: ${updated.orderNumber}`,
          `Great news! Your manual payment proof (UTR/Ref: ${updated.paymentProofRef || 'Approved'}) has been verified and approved by our team. Your order #${updated.orderNumber} is now confirmed!`
        );
      }

      return updatedOrders;
    });
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order['orderStatus'],
    note?: string,
    trackingNumber?: string
  ) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((order) => {
        if (order.id === orderId) {
          const newHistory = [
            ...order.statusHistory,
            {
              status,
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              note: note || `Status updated to ${status}`,
              updatedBy: 'Admin',
            },
          ];
          return {
            ...order,
            orderStatus: status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
            statusHistory: newHistory,
          };
        }
        return order;
      });

      // Send dispatch email if shipped
      const updatedOrder = updatedOrders.find((o) => o.id === orderId);
      if (updatedOrder) {
        if (status === 'shipped') {
          sendDirectCustomerEmail(
            updatedOrder.customerEmail,
            updatedOrder.customerName,
            `Your Order ${updatedOrder.orderNumber} has been shipped!`,
            `Great news! Your order is on its way. ${trackingNumber ? `Tracking Number: ${trackingNumber}` : ''}`
          );
        } else if (status === 'confirmed') {
          sendDirectCustomerEmail(
            updatedOrder.customerEmail,
            updatedOrder.customerName,
            `Order Confirmed: ${updatedOrder.orderNumber}`,
            `Thank you for your order! We are currently processing it.`
          );
        } else if (status === 'cancelled') {
           sendDirectCustomerEmail(
            updatedOrder.customerEmail,
            updatedOrder.customerName,
            `Order Cancelled: ${updatedOrder.orderNumber}`,
            `Your order has been cancelled. If you have any questions, please contact us.`
          );
        }
      }
      return updatedOrders;
    });
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const newHistory = [
            ...order.statusHistory,
            {
              status: order.orderStatus,
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              note: `Payment status updated to ${paymentStatus.toUpperCase()}`,
              updatedBy: 'Admin',
            },
          ];
          return {
            ...order,
            paymentStatus,
            statusHistory: newHistory,
          };
        }
        return order;
      })
    );
  };

  const updateOrderTracking = (orderId: string, trackingNumber: string, courierName?: string) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((order) => {
        if (order.id === orderId) {
          const noteText = `Tracking added: ${trackingNumber}${courierName ? ` via ${courierName}` : ''}`;
          const newHistory = [
            ...order.statusHistory,
            {
              status: order.orderStatus,
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              note: noteText,
              updatedBy: 'Admin',
            },
          ];
          return {
            ...order,
            trackingNumber,
            courierName: courierName || order.courierName,
            statusHistory: newHistory,
          };
        }
        return order;
      });

      const updated = updatedOrders.find((o) => o.id === orderId);
      if (updated) {
        sendDirectCustomerEmail(
          updated.customerEmail,
          updated.customerName,
          `Tracking details updated for order ${updated.orderNumber}`,
          `Your package is moving! Courier: ${courierName || updated.courierName || 'Standard Express'}, Tracking Number: ${trackingNumber}`
        );
      }

      return updatedOrders;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Product & Coupon CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: 'prod_' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productData } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        setSettings,
        updateSettings,
        paymentGateways,
        setPaymentGateways,
        updatePaymentGateways,
        products,
        setProducts,
        activeProducts,
        categories,
        setCategories,
        activeCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        addNestedSubcategory,
        updateNestedSubcategory,
        deleteNestedSubcategory,
        customers,
        setCustomers,
        sendDirectCustomerEmail,
        tickets,
        setTickets,
        updateTicketStatus,
        replyToTicket,
        createTicket,
        broadcasts,
        sendEmailBroadcast,
        cart,
        wishlist,
        orders,
        setOrders,
        coupons,
        setCoupons,
        reviews,
        addReview,
        appliedCoupon,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedNestedSubcategory,
        setSelectedNestedSubcategory,
        budgetFilter,
        setBudgetFilter,
        sortOption,
        setSortOption,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        lastCreatedOrder,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        createOrder,
        approveManualPayment,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateOrderTracking,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        deleteCoupon,
        cartSubtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        cartGrandTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
