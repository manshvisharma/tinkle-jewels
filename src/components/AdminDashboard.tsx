import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Coupon, Order, Category, Subcategory, NestedSubcategory, CustomerUser, SupportTicket, EmailBroadcast, ProductVariant } from '../types';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';
import { ConfirmDialog } from './ConfirmDialog';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  CreditCard,
  Tag,
  Mail,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PackageCheck,
  PackageX,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Send,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Percent,
  Search,
  Filter,
  Check,
  Printer,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Star,
  Menu,
  X,
  Layers,
  Eye,
  EyeOff,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Grid,
  Columns,
  Maximize2,
  SlidersHorizontal,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    addNestedSubcategory,
    updateNestedSubcategory,
    deleteNestedSubcategory,
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderTracking,
    deleteOrder,
    coupons,
    setCoupons,
    addCoupon,
    deleteCoupon,
    customers,
    sendDirectCustomerEmail,
    tickets,
    updateTicketStatus,
    replyToTicket,
    broadcasts,
    sendEmailBroadcast,
    paymentGateways,
    updatePaymentGateways,
    settings,
    updateSettings,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'products' | 'categories' | 'orders' | 'customers' | 'gateways' | 'coupons' | 'emails' | 'settings'
  >('analytics');

  // Mobile navigation state
  const [isMobileAdminNavOpen, setIsMobileAdminNavOpen] = useState(false);

  // Product modal states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Order Details Modal
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Global Confirmation Dialog State
  const [confirmDialogState, setConfirmDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Variant viewer focus state (step through variant cards)
  const [focusedVariantIndex, setFocusedVariantIndex] = useState<number>(0);
  const [variantViewMode, setVariantViewMode] = useState<'card' | 'grid'>('card');

  // URL image input helper
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Admin Password Change State
  const [adminCurrentPass, setAdminCurrentPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAdminPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminNewPass.length < 6) {
      setAdminPassMsg({ type: 'error', text: 'New admin password must be at least 6 characters.' });
      return;
    }
    if (adminNewPass !== adminConfirmPass) {
      setAdminPassMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    updateSettings({ adminPassword: adminNewPass });
    setAdminPassMsg({ type: 'success', text: '✨ Admin password updated successfully!' });
    setAdminCurrentPass('');
    setAdminNewPass('');
    setAdminConfirmPass('');
    confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#38ef7d'] });
  };

  // New Product Form State (with variants support)
  const [productForm, setProductForm] = useState<{
    name: string;
    category: string;
    subCategory: string;
    nestedSubCategory: string;
    price: number;
    originalPrice: number;
    sku: string;
    stockCount: number;
    material: string;
    shortDescription: string;
    description: string;
    highlights: string[];
    careInstructions: string;
    primaryImage: string;
    hoverImage: string;
    galleryImages: string[];
    badges: ('NEW' | 'BEST SELLER' | 'SALE' | 'CUSTOM' | 'TRENDING' | 'LIMITED')[];
    colors: { name: string; hex: string; image?: string; price?: number }[];
    sizes: string[];
    variants: ProductVariant[];
    isActive: boolean;
    inStock: boolean;
  }>({
    name: '',
    category: 'jewellery',
    subCategory: 'earrings',
    nestedSubCategory: 'hoops',
    price: 799,
    originalPrice: 1099,
    sku: `TKL-${Math.floor(1000 + Math.random() * 9000)}`,
    stockCount: 25,
    material: '18k Gold Plated Stainless Steel',
    shortDescription: '',
    description: '',
    highlights: ['18k Real Gold PVD Plating — Anti-tarnish', 'Hypoallergenic & Waterproof', 'Comes in pink velvet signature pouch'],
    careInstructions: 'Wipe with soft cloth after daily wear. Safe in water.',
    primaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    galleryImages: [],
    badges: ['NEW'],
    colors: [
      { name: '18k Gold', hex: '#E5C158', image: '' },
      { name: 'Rose Gold', hex: '#E6A8A8', image: '' },
      { name: 'Silver', hex: '#D8D8D8', image: '' },
    ],
    sizes: ['Free Size', 'S', 'M', 'L'],
    variants: [],
    isActive: true,
    inStock: true,
  });

  // Local File Upload for Product Gallery
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedFilePreview(base64);
        setProductForm((prev) => {
          if (!prev.primaryImage) {
            return { ...prev, primaryImage: base64 };
          }
          return { ...prev, galleryImages: [...(prev.galleryImages || []), base64] };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Product Image Reordering and Management
  const handleMoveProductImage = (index: number, direction: 'left' | 'right') => {
    const allImages = [productForm.primaryImage, ...(productForm.galleryImages || [])].filter(Boolean);
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= allImages.length) return;
    const temp = allImages[index];
    allImages[index] = allImages[targetIndex];
    allImages[targetIndex] = temp;
    setProductForm((prev) => ({
      ...prev,
      primaryImage: allImages[0] || '',
      hoverImage: allImages[1] || allImages[0] || '',
      galleryImages: allImages.slice(1),
    }));
  };

  const handleSetMainProductImage = (index: number) => {
    const allImages = [productForm.primaryImage, ...(productForm.galleryImages || [])].filter(Boolean);
    if (index === 0 || index >= allImages.length) return;
    const selected = allImages.splice(index, 1)[0];
    allImages.unshift(selected);
    setProductForm((prev) => ({
      ...prev,
      primaryImage: allImages[0],
      hoverImage: allImages[1] || allImages[0],
      galleryImages: allImages.slice(1),
    }));
  };

  const handleDeleteProductImage = (index: number) => {
    const allImages = [productForm.primaryImage, ...(productForm.galleryImages || [])].filter(Boolean);
    if (index >= allImages.length) return;
    allImages.splice(index, 1);
    setProductForm((prev) => ({
      ...prev,
      primaryImage: allImages[0] || '',
      hoverImage: allImages[1] || allImages[0] || '',
      galleryImages: allImages.slice(1),
    }));
  };

  const handleAddProductImageUrl = () => {
    if (!newImageUrlInput.trim()) return;
    const url = newImageUrlInput.trim();
    setProductForm((prev) => {
      if (!prev.primaryImage) {
        return { ...prev, primaryImage: url };
      }
      return { ...prev, galleryImages: [...(prev.galleryImages || []), url] };
    });
    setNewImageUrlInput('');
  };

  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatActive, setNewCatActive] = useState(true);
  const [selectedCatForSub, setSelectedCatForSub] = useState<string>('jewellery');
  const [newSubName, setNewSubName] = useState('');
  const [selectedCatForNested, setSelectedCatForNested] = useState<string>('jewellery');
  const [selectedSubForNested, setSelectedSubForNested] = useState<string>('sub_1');
  const [newNestedName, setNewNestedName] = useState('');

  // Category image upload handler
  const handleCatImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEdit && editingCategory) {
          setEditingCategory((prev) => (prev ? { ...prev, image: base64 } : null));
        } else {
          setNewCatImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Variant Matrix generation
  const [matrixColors, setMatrixColors] = useState('');
  const [matrixSizes, setMatrixSizes] = useState('');

  // Editing Category / Subcategory / Nested Subcategory states
  const [editingSubcategory, setEditingSubcategory] = useState<{
    categoryId: string;
    subcategoryId: string;
    name: string;
  } | null>(null);
  const [editingNestedSubcategory, setEditingNestedSubcategory] = useState<{
    categoryId: string;
    subcategoryId: string;
    nestedId: string;
    name: string;
  } | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    categoryId: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
    isActive?: boolean;
  } | null>(null);

  // Customer Orders & Direct Email Management State
  const [selectedCustomerForOrders, setSelectedCustomerForOrders] = useState<CustomerUser | null>(null);
  const [customerEmailSubject, setCustomerEmailSubject] = useState('Important Update from Tinkle Jewels Studio');
  const [customerEmailBody, setCustomerEmailBody] = useState('');
  const [emailSendSuccess, setEmailSendSuccess] = useState<boolean>(false);

  // Coupon Form State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [couponForm, setCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 799,
    maxDiscount: 500,
    description: '',
    expiryDate: '2026-12-31',
    usageCount: 0,
    maxUsage: 500,
    perUserLimit: 2,
    isActive: true,
  });

  // Broadcast Form State
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<EmailBroadcast['recipientType']>('all_users');

  // Support Reply State
  const [ticketReplyText, setTicketReplyText] = useState<{ [key: string]: string }>({});

  // Analytics Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.grandTotal : sum), 0);
  const totalOrdersCount = orders.length;
  const fulfilledOrders = orders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'cancelled').length;
  const repeatBuyersCount = customers.filter((c) => c.isRepeatCustomer).length;
  const repeatBuyerRate = customers.length ? Math.round((repeatBuyersCount / customers.length) * 100) : 40;

  // Monthly breakdown mockup data
  const monthlyData = [
    { month: 'Mar', sales: 48500, orders: 58 },
    { month: 'Apr', sales: 62100, orders: 74 },
    { month: 'May', sales: 78900, orders: 92 },
    { month: 'Jun', sales: 94200, orders: 110 },
    { month: 'Jul', sales: 112400, orders: 135 },
    { month: 'Aug (Current)', sales: totalRevenue + 138000, orders: totalOrdersCount + 152 },
  ];

  // Add and update product variants (automatically generated from cross matrix)
  const handleGenerateMatrix = () => {
    const colors = matrixColors.split(',').map(c => c.trim()).filter(Boolean);
    const sizes = matrixSizes.split(',').map(s => s.trim()).filter(Boolean);
    
    if (colors.length === 0 && sizes.length === 0) return;

    let generated: ProductVariant[] = [];
    const baseColors = colors.length > 0 ? colors : [''];
    const baseSizes = sizes.length > 0 ? sizes : [''];

    const colorHexMap: { [key: string]: string } = {
      'gold': '#E5C158',
      '18k gold': '#E5C158',
      'yellow gold': '#E5C158',
      'rose gold': '#E6A8A8',
      'silver': '#D8D8D8',
      'platinum': '#E5E4E2',
      'black': '#222222',
      'white': '#FFFFFF',
      'emerald': '#50C878',
      'ruby': '#E0115F',
      'sapphire': '#0F52BA',
      'pink': '#FFC0CB',
    };

    baseColors.forEach((color) => {
      baseSizes.forEach((size) => {
        const nameParts = [productForm.name || 'Item', color, size].filter(Boolean);
        const name = nameParts.join(' - ');
        const id = 'var_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const colorLower = color.toLowerCase();
        const matchedHex = colorHexMap[colorLower] || (color ? '#E5C158' : undefined);

        generated.push({
          id,
          name,
          sku: `${productForm.sku || 'TKL'}-${color ? color.substring(0, 3).toUpperCase() : 'DEF'}${size ? '-' + size.toUpperCase() : ''}-${Math.floor(100 + Math.random()*900)}`,
          price: productForm.price || 799,
          salePrice: productForm.originalPrice || undefined,
          stock: productForm.stockCount || 20,
          images: productForm.primaryImage ? [productForm.primaryImage] : [],
          attributes: {
            color: color || undefined,
            size: size || undefined,
            hex: matchedHex,
            type: 'Variant'
          }
        });
      });
    });

    setProductForm((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), ...generated],
    }));
    setFocusedVariantIndex(productForm.variants?.length || 0);
    setMatrixColors('');
    setMatrixSizes('');
    confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#E5C158', '#38ef7d'] });
  };

  const handleAddVariant = () => {
    const varCount = (productForm.variants?.length || 0) + 1;
    const newVariant: ProductVariant = {
      id: 'var_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: `${productForm.name || 'Item'} Variant #${varCount}`,
      sku: `${productForm.sku || 'TKL'}-V${varCount}`,
      price: productForm.price || 799,
      salePrice: productForm.originalPrice || undefined,
      stock: productForm.stockCount || 20,
      images: productForm.primaryImage ? [productForm.primaryImage] : [],
      attributes: {
        type: 'Variant',
        color: 'Rose Gold',
        size: 'Standard',
      },
    };
    setProductForm((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant],
    }));
    setFocusedVariantIndex((productForm.variants?.length || 0));
    confetti({ particleCount: 20, spread: 35, colors: ['#C4436A', '#E5C158'] });
  };

  const handleUpdateVariant = (varId: string, updates: Partial<ProductVariant>) => {
    setProductForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v) => (v.id === varId ? { ...v, ...updates } : v)),
    }));
  };

  const handleRemoveVariant = (varId: string) => {
    setProductForm((prev) => {
      const filtered = (prev.variants || []).filter((v) => v.id !== varId);
      return {
        ...prev,
        variants: filtered,
      };
    });
    setFocusedVariantIndex((prev) => Math.max(0, prev - 1));
  };

  // Variant Multi-Image Handlers
  const handleVariantFileUpload = (varId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProductForm((prev) => ({
          ...prev,
          variants: (prev.variants || []).map((v) =>
            v.id === varId ? { ...v, images: [...(v.images || []), base64] } : v
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantAddImageUrl = (varId: string, url: string) => {
    if (!url.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v) =>
        v.id === varId ? { ...v, images: [...(v.images || []), url.trim()] } : v
      ),
    }));
  };

  const handleVariantRemoveImage = (varId: string, imgIdx: number) => {
    setProductForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v) => {
        if (v.id === varId) {
          const newImgs = [...(v.images || [])];
          newImgs.splice(imgIdx, 1);
          return { ...v, images: newImgs };
        }
        return v;
      }),
    }));
  };

  const handleVariantSetMainImage = (varId: string, imgIdx: number) => {
    setProductForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v) => {
        if (v.id === varId) {
          const newImgs = [...(v.images || [])];
          if (imgIdx > 0 && imgIdx < newImgs.length) {
            const selected = newImgs.splice(imgIdx, 1)[0];
            newImgs.unshift(selected);
          }
          return { ...v, images: newImgs };
        }
        return v;
      }),
    }));
  };

  const handleVariantMoveImage = (varId: string, imgIdx: number, direction: 'left' | 'right') => {
    setProductForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v) => {
        if (v.id === varId) {
          const newImgs = [...(v.images || [])];
          const target = direction === 'left' ? imgIdx - 1 : imgIdx + 1;
          if (target >= 0 && target < newImgs.length) {
            const temp = newImgs[imgIdx];
            newImgs[imgIdx] = newImgs[target];
            newImgs[target] = temp;
          }
          return { ...v, images: newImgs };
        }
        return v;
      }),
    }));
  };

  // Save Product Form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        ...productForm,
        variants: productForm.variants || [],
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
      setEditingProductId(null);
    } else {
      addProduct({
        ...productForm,
        variants: productForm.variants || [],
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviewCount: 1,
        inStock: productForm.inStock ?? true,
        isActive: productForm.isActive ?? true,
        tags: [productForm.category, productForm.subCategory, 'new-arrival'].filter(Boolean),
      });
    }

    setIsAddProductOpen(false);
    confetti({ particleCount: 35, spread: 50, colors: ['#C4436A', '#E5C158', '#F5C2E7'] });
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;
    addCoupon({
      ...couponForm,
      code: couponForm.code.toUpperCase().trim(),
      description: couponForm.description || `${couponForm.code} Special Promo`,
    });
    setIsAddCouponOpen(false);
    confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#E5C158'] });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastContent) return;
    sendEmailBroadcast(broadcastSubject, broadcastContent, broadcastAudience);
    setBroadcastSubject('');
    setBroadcastContent('');
    confetti({ particleCount: 40, spread: 60, colors: ['#C4436A', '#38ef7d'] });
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2C2329] flex flex-col md:flex-row">
      
      {/* 0. SMARTPHONE MOBILE TOPBAR WITH 3-LINE COLLAPSE/EXPAND MENU */}
      <div className="md:hidden bg-[#1F141B] text-white sticky top-0 z-40 border-b border-[#38222E] px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="admin-mobile-menu-toggle"
              onClick={() => setIsMobileAdminNavOpen(!isMobileAdminNavOpen)}
              className="p-2 rounded-xl bg-[#2D1B27] text-[#F38BA0] hover:text-white hover:bg-[#3D2535] transition-colors cursor-pointer"
              aria-label="Toggle Admin Navigation"
            >
              {isMobileAdminNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C4436A] to-[#F38BA0] flex items-center justify-center font-serif text-white font-bold text-xs">
                TJ
              </div>
              <span className="font-display font-bold text-sm tracking-wide">Tinkle Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#F38BA0] bg-[#38222E] px-2.5 py-1 rounded-full capitalize">
              {activeTab}
            </span>
            <button
              onClick={() => setActiveView('home')}
              className="text-xs text-[#EADDE4] bg-[#2D1B27] p-1.5 rounded-lg hover:text-white"
              title="Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileAdminNavOpen && (
          <nav className="mt-3 pt-3 border-t border-[#38222E] space-y-1.5 max-h-[75vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                setActiveTab('analytics');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'analytics' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard &amp; Charts</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'products' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products &amp; Variants</span>
              </div>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{products.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'categories' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>Category Hierarchy</span>
              </div>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{categories.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'orders' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders &amp; Invoices</span>
              </div>
              <span className="text-[10px] bg-[#C4436A] text-white px-2 py-0.5 rounded-full">{orders.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('customers');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'customers' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customers &amp; Cohorts</span>
              </div>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{customers.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('gateways');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'gateways' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Gateways</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('coupons');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'coupons' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Coupons &amp; Discounts</span>
              </div>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{coupons.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('emails');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'emails' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Email &amp; Helpdesk</span>
              </div>
              {tickets.filter((t) => t.status === 'pending').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileAdminNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'settings' ? 'bg-[#C4436A] text-white' : 'text-[#C7B3BF] bg-[#2D1B27]'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Store &amp; Social Proof</span>
            </button>
          </nav>
        )}
      </div>

      {/* 1. LEFT SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex w-64 bg-[#1F141B] text-[#EADDE4] flex-shrink-0 border-r border-[#38222E] flex-col">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#38222E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C4436A] to-[#F38BA0] flex items-center justify-center font-serif text-white font-bold text-sm shadow-md">
              TJ
            </div>
            <div>
              <h2 className="font-display font-semibold text-white text-base tracking-wide">Tinkle Jewels</h2>
              <span className="text-[10px] text-[#F38BA0] font-mono tracking-widest uppercase block">Store Admin v2.4</span>
            </div>
          </div>
          <button
            onClick={() => setActiveView('home')}
            className="text-xs text-[#EADDE4] hover:text-white bg-[#38222E] p-1.5 rounded-lg transition-colors cursor-pointer"
            title="View Live Store"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 text-xs font-medium overflow-y-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard &amp; Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products &amp; Variants</span>
            </div>
            <span className="text-[10px] bg-[#38222E] px-2 py-0.5 rounded-full">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" />
              <span>Category Hierarchy</span>
            </div>
            <span className="text-[10px] bg-[#38222E] px-2 py-0.5 rounded-full">{categories.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders &amp; Invoices</span>
            </div>
            <span className="text-[10px] bg-[#C4436A] text-white px-2 py-0.5 rounded-full font-bold">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'customers' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Customers &amp; Cohorts</span>
            </div>
            <span className="text-[10px] bg-[#38222E] px-2 py-0.5 rounded-full">{customers.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'gateways' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Gateways</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'coupons' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" />
              <span>Coupons &amp; Discounts</span>
            </div>
            <span className="text-[10px] bg-[#38222E] px-2 py-0.5 rounded-full">{coupons.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'emails' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span>Email &amp; Helpdesk</span>
            </div>
            {tickets.filter((t) => t.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#C4436A] text-white font-bold shadow-md' : 'text-[#C7B3BF] hover:bg-[#2C1C26] hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Store &amp; Social Proof</span>
          </button>
        </nav>

        {/* Admin Footer Info */}
        <div className="p-4 border-t border-[#38222E] text-[11px] text-[#A68F9D] flex items-center justify-between">
          <span>cPanel DB: <strong>Connected</strong></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#FBE6EF] shadow-xs">
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-[#241A20] capitalize font-medium">
              {activeTab === 'analytics' && 'Executive Analytics & Performance'}
              {activeTab === 'products' && 'Product Matrix & Inventory'}
              {activeTab === 'categories' && 'Category Tree & Nested Taxonomy'}
              {activeTab === 'orders' && 'Customer Orders & Fulfillment'}
              {activeTab === 'customers' && 'Customer Directory & Retention'}
              {activeTab === 'gateways' && 'Payment Gateway Configuration'}
              {activeTab === 'coupons' && 'Promotions & Coupon Rules'}
              {activeTab === 'emails' && 'Email Broadcasts & Helpdesk'}
              {activeTab === 'settings' && 'Store Branding & Social Proof'}
            </h1>
            <p className="text-xs text-[#7A6370] mt-0.5">
              Manage your Gen-Z boutique e-commerce platform with real-time MySQL persistence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('home')}
              className="btn-tinkle-outline text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span>Back to Store</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ANALYTICS & REVENUE CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 4 Stat KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#7A6370] text-xs font-semibold">
                  <span>Gross Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#C4436A] flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#241A20] font-sans">
                  ₹{(totalRevenue + 138000).toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% from last month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#7A6370] text-xs font-semibold">
                  <span>Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#C4436A] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#241A20] font-sans">
                  {totalOrdersCount + 152}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.6% order volume</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#7A6370] text-xs font-semibold">
                  <span>Repeat Customer Rate</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#C4436A] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#241A20] font-sans">
                  {repeatBuyerRate}%
                </div>
                <div className="text-[11px] text-[#7A6370]">
                  {repeatBuyersCount} verified returning buyers
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[#7A6370] text-xs font-semibold">
                  <span>Order Cancellation Rate</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] text-[#C4436A] flex items-center justify-center">
                    <PackageX className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#241A20] font-sans">
                  1.2%
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>-0.4% drop in returns</span>
                </div>
              </div>
            </div>

            {/* Sales Growth Chart & Drop Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Bar Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg text-[#241A20]">Monthly Sales Performance</h3>
                    <p className="text-xs text-[#7A6370]">6-Month revenue &amp; order trajectory</p>
                  </div>
                  <span className="text-xs font-bold text-[#C4436A] bg-[#FFF0F5] px-3 py-1 rounded-full">
                    2026 Live
                  </span>
                </div>

                <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#F7D8E4]">
                  {monthlyData.map((d, i) => {
                    const heightPercent = Math.round((d.sales / 150000) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-[#C4436A] opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{(d.sales / 1000).toFixed(0)}k
                        </span>
                        <div className="w-full bg-[#FCE1EB] rounded-t-xl h-full flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-[#C4436A] to-[#F38BA0] rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#7A6370] font-medium text-center truncate max-w-[60px]">
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-[#7A6370] pt-2">
                  <span>Lowest: ₹48.5k (March)</span>
                  <span className="text-emerald-700 font-bold">Peak: ₹{(totalRevenue + 138000).toLocaleString()} (Current Month)</span>
                </div>
              </div>

              {/* Top Customers Leaderboard */}
              <div className="bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg text-[#241A20]">Top VIP Customers</h3>
                    <p className="text-xs text-[#7A6370]">Ranked by lifetime value</p>
                  </div>
                  <Users className="w-4 h-4 text-[#C4436A]" />
                </div>

                <div className="space-y-3 divide-y divide-[#FDF0F5]">
                  {customers.slice(0, 5).map((c, i) => (
                    <div key={c.id} className="pt-2.5 first:pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#FFF0F5] text-[#C4436A] font-bold text-[10px] flex items-center justify-center">
                          #{i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#241A20]">{c.name}</p>
                          <span className="text-[10px] text-[#8C7582]">@{c.username} &bull; {c.totalOrders} orders</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-[#C4436A]">₹{(c.totalSpent || 0).toLocaleString()}</span>
                        {c.isRepeatCustomer && (
                          <span className="block text-[9px] font-bold text-emerald-700 uppercase">Repeat VIP</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOGUE & LOCAL IMAGE UPLOADER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#FBE6EF]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#A68F9D]" />
                  <input
                    type="text"
                    placeholder="Search SKU or title..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#F5D0DF] focus:outline-[#C4436A]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-[#F5D0DF] bg-white font-medium text-[#241A20]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    name: '',
                    category: 'jewellery',
                    subCategory: 'earrings',
                    nestedSubCategory: 'hoops',
                    price: 799,
                    originalPrice: 1099,
                    sku: `TKL-${Math.floor(1000 + Math.random() * 9000)}`,
                    stockCount: 25,
                    material: '18k Gold Plated Stainless Steel',
                    shortDescription: '',
                    description: '',
                    highlights: ['18k Real Gold PVD Plating — Anti-tarnish', 'Hypoallergenic & Waterproof', 'Comes in pink velvet signature pouch'],
                    careInstructions: 'Wipe with soft cloth after daily wear. Safe in water.',
                    primaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
                    hoverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
                    galleryImages: [],
                    badges: ['NEW'],
                    colors: [
                      { name: '18k Gold', hex: '#E5C158' },
                      { name: 'Rose Gold', hex: '#E6A8A8' },
                    ],
                    sizes: ['Free Size', 'S', 'M', 'L'],
                  });
                  setIsAddProductOpen(true);
                }}
                className="w-full sm:w-auto btn-tinkle text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item &amp; Upload Images</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl border border-[#FBE6EF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF0F5] text-[#8C3A5A] font-bold border-b border-[#F7D8E4]">
                    <tr>
                      <th className="p-4">Product Info</th>
                      <th className="p-4">Taxonomy Hierarchy</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Variants</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FDF0F5]">
                    {products
                      .filter((p) => {
                        const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
                        const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
                        return matchesSearch && matchesCat;
                      })
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#FFF9FB] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.primaryImage}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#F7D8E4] shadow-xs"
                              />
                              <div>
                                <span className="font-bold text-xs text-[#241A20] block">{prod.name}</span>
                                <span className="text-[10px] font-mono text-[#8C7582]">{prod.sku}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="text-[11px] space-y-0.5">
                              <span className="font-bold text-[#C4436A] capitalize">{prod.category}</span>
                              {prod.subCategory && (
                                <span className="text-[#7A6370] block">&rarr; {prod.subCategory}</span>
                              )}
                              {prod.nestedSubCategory && (
                                <span className="text-[#9E8292] text-[10px] block">&bull; {prod.nestedSubCategory}</span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 font-bold text-[#C4436A]">
                        <div className="flex items-center gap-1.5">
                          <span>₹{(prod.price || 0).toLocaleString()}</span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-[#A68F9D] line-through font-normal">
                              ₹{prod.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => {
                            const newInStock = prod.inStock === false ? true : false;
                            updateProduct(prod.id, {
                              inStock: newInStock,
                              stockCount: newInStock ? (prod.stockCount > 0 ? prod.stockCount : 15) : 0,
                            });
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                            prod.inStock !== false && prod.stockCount > 0
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                          title="Click to toggle Stock Status"
                        >
                          {prod.inStock !== false && prod.stockCount > 0 ? `✓ ${prod.stockCount} in stock` : '✕ Out of Stock'}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 items-center">
                          {prod.colors?.map((c) => (
                            <span key={c.name} className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs" style={{ backgroundColor: c.hex }} title={c.name} />
                          ))}
                          <span className="text-[10px] text-[#7A6370] ml-1 font-medium">
                            {prod.variants?.length ? `${prod.variants.length} matrix vars` : prod.sizes?.length ? `${prod.sizes.length} sizes` : 'Standard'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              updateProduct(prod.id, { isActive: prod.isActive === false ? true : false });
                            }}
                            className={`text-[10px] font-bold px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              prod.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title={prod.isActive !== false ? "Hide from Storefront" : "Show on Storefront"}
                          >
                            {prod.isActive !== false ? 'Visible' : 'Hidden'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingProductId(prod.id);
                              setProductForm({
                                name: prod.name,
                                category: prod.category,
                                subCategory: prod.subCategory || '',
                                nestedSubCategory: prod.nestedSubCategory || '',
                                price: prod.price,
                                originalPrice: prod.originalPrice || prod.price,
                                sku: prod.sku,
                                stockCount: prod.stockCount,
                                material: prod.material || '',
                                shortDescription: prod.shortDescription || '',
                                description: prod.description || '',
                                highlights: prod.highlights || [],
                                careInstructions: prod.careInstructions || '',
                                primaryImage: prod.primaryImage,
                                hoverImage: prod.hoverImage || prod.primaryImage,
                                galleryImages: prod.galleryImages || [],
                                badges: prod.badges || ['NEW'],
                                colors: prod.colors || [],
                                sizes: prod.sizes || [],
                                variants: prod.variants || [],
                                isActive: prod.isActive !== false,
                                inStock: prod.inStock !== false && prod.stockCount > 0,
                              });
                              setFocusedVariantIndex(0);
                              setIsAddProductOpen(true);
                            }}
                            className="p-2 text-[#7A6370] hover:text-[#C4436A] hover:bg-[#FFF0F5] rounded-xl transition-colors cursor-pointer"
                            title="Edit Product & Specs"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialogState({
                                isOpen: true,
                                title: 'Delete Product',
                                message: `Are you sure you want to delete "${prod.name}" (${prod.sku})? This cannot be undone.`,
                                confirmText: 'Delete Item',
                                onConfirm: () => deleteProduct(prod.id),
                              });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRODUCT CREATION / EDITING MODAL */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                <div className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-[#FBE6EF] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#F7D8E4] pb-4">
                    <div>
                      <h3 className="font-display text-xl text-[#241A20]">
                        {editingProductId ? 'Edit Product & Variant Matrix' : 'Add New Boutique Item'}
                      </h3>
                      <p className="text-xs text-[#7A6370]">Upload photos, set dynamic category taxonomy and customize product variants.</p>
                    </div>
                    <button
                      onClick={() => setIsAddProductOpen(false)}
                      className="p-2 text-[#8C7582] hover:text-black rounded-xl cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                          placeholder="e.g. 18k Rose Gold Butterfly Choker"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">SKU Code *</label>
                        <input
                          type="text"
                          required
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF] font-mono"
                        />
                      </div>
                    </div>

                    {/* Taxonomy Selectors (Main Category -> Sub -> Nested only if available) */}
                    <div className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-3">
                      <span className="font-bold text-[#8C3A5A] uppercase tracking-wider block">Taxonomy &amp; Hierarchy Placement</span>
                      
                      {(() => {
                        const currentCat = categories.find((c) => c.slug === productForm.category || c.id === productForm.category) || categories[0];
                        const availableSubs = currentCat?.subcategories || [];
                        const currentSub = availableSubs.find(
                          (s) => s.slug === productForm.subCategory || s.name.toLowerCase() === productForm.subCategory.toLowerCase()
                        ) || availableSubs[0];
                        const availableNested = currentSub?.nestedSubcategories || [];
                        const hasNested = availableNested.length > 0;

                        return (
                          <div className={`grid grid-cols-1 ${hasNested ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                            {/* 1. Main Category */}
                            <div>
                              <label className="font-bold text-[#8C3A5A] block mb-1">1. Main Category *</label>
                              <select
                                value={productForm.category}
                                onChange={(e) => {
                                  const newCatSlug = e.target.value;
                                  const selectedCat = categories.find((c) => c.slug === newCatSlug || c.id === newCatSlug);
                                  const firstSub = selectedCat?.subcategories?.[0]?.slug || selectedCat?.subcategories?.[0]?.name.toLowerCase() || '';
                                  const firstNested = selectedCat?.subcategories?.[0]?.nestedSubcategories?.[0]?.slug || '';
                                  setProductForm({
                                    ...productForm,
                                    category: newCatSlug,
                                    subCategory: firstSub,
                                    nestedSubCategory: firstNested,
                                  });
                                }}
                                className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white capitalize font-semibold text-[#241A20]"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* 2. Subcategory */}
                            <div>
                              <label className="font-bold text-[#8C3A5A] block mb-1">2. Subcategory *</label>
                              {availableSubs.length > 0 ? (
                                <select
                                  value={productForm.subCategory}
                                  onChange={(e) => {
                                    const newSubSlug = e.target.value;
                                    const selectedSub = availableSubs.find((s) => s.slug === newSubSlug || s.name.toLowerCase() === newSubSlug.toLowerCase());
                                    const firstNested = selectedSub?.nestedSubcategories?.[0]?.slug || '';
                                    setProductForm({
                                      ...productForm,
                                      subCategory: newSubSlug,
                                      nestedSubCategory: firstNested,
                                    });
                                  }}
                                  className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-semibold text-[#241A20]"
                                >
                                  {availableSubs.map((s) => (
                                    <option key={s.id} value={s.slug || s.name.toLowerCase()}>{s.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={productForm.subCategory}
                                  onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                                  className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                                  placeholder="e.g. Earrings"
                                />
                              )}
                            </div>

                            {/* 3. Nested Type (HIDDEN IF SUBCATEGORY HAS NO NESTED SUBCATEGORIES) */}
                            {hasNested && (
                              <div>
                                <label className="font-bold text-[#8C3A5A] block mb-1">3. Nested Type</label>
                                <select
                                  value={productForm.nestedSubCategory}
                                  onChange={(e) => setProductForm({ ...productForm, nestedSubCategory: e.target.value })}
                                  className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-semibold text-[#241A20]"
                                >
                                  {availableNested.map((n) => (
                                    <option key={n.id} value={n.slug || n.name.toLowerCase()}>{n.name}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Pricing & Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Base Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Original / Compare Price (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Inventory Stock Units *</label>
                        <input
                          type="number"
                          required
                          value={productForm.stockCount}
                          onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>
                    </div>

                    {/* PRODUCT IMAGES & REORDERING GALLERY */}
                    <div className="p-4 sm:p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="font-bold text-[#3D2C35] flex items-center gap-1.5 text-xs">
                            <ImageIcon className="w-4 h-4 text-[#C4436A]" />
                            <span>Product Images &amp; Sequence Rearrangement</span>
                          </label>
                          <span className="text-[11px] text-[#7A6370]">The 1st photo is the Main Storefront Cover. Rearrange or promote any photo to Main.</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#C4436A] bg-[#FFF0F5] px-2.5 py-1 rounded-full w-fit">
                          {[productForm.primaryImage, ...(productForm.galleryImages || [])].filter(Boolean).length} Photos Total
                        </span>
                      </div>

                      {/* Visual Image Grid with Drag/Order Controls */}
                      {(() => {
                        const allImgs = [productForm.primaryImage, ...(productForm.galleryImages || [])].filter(Boolean);
                        if (allImgs.length === 0) {
                          return (
                            <div className="text-center py-6 border-2 border-dashed border-[#FAD2E2] rounded-2xl bg-white">
                              <ImageIcon className="w-8 h-8 text-[#D8B4C6] mx-auto mb-2" />
                              <p className="text-xs text-[#7A6370] font-medium">No images uploaded yet. Upload a local file or paste a CDN link below.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {allImgs.map((imgUrl, imgIdx) => {
                              const isMain = imgIdx === 0;
                              const isHover = imgIdx === 1;

                              return (
                                <div
                                  key={imgIdx}
                                  className={`relative group rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-xs ${
                                    isMain ? 'border-[#C4436A] ring-2 ring-[#C4436A]/20' : 'border-[#F7D8E4] hover:border-[#C4436A]'
                                  }`}
                                >
                                  {/* Badge Tag */}
                                  <div className="absolute top-1.5 left-1.5 z-10">
                                    {isMain && (
                                      <span className="bg-[#C4436A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                                        ★ MAIN
                                      </span>
                                    )}
                                    {isHover && !isMain && (
                                      <span className="bg-[#2D1B27] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                                        2: HOVER
                                      </span>
                                    )}
                                    {!isMain && !isHover && (
                                      <span className="bg-white/90 text-[#3D2C35] text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs border border-gray-200">
                                        #{imgIdx + 1}
                                      </span>
                                    )}
                                  </div>

                                  {/* Image Thumbnail */}
                                  <img
                                    src={imgUrl}
                                    alt={`Product ${imgIdx + 1}`}
                                    className="w-full h-24 sm:h-28 object-cover"
                                  />

                                  {/* Controls Overlay */}
                                  <div className="p-1.5 bg-[#FFF0F5] border-t border-[#F7D8E4] flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-0.5">
                                      <button
                                        type="button"
                                        disabled={imgIdx === 0}
                                        onClick={() => handleMoveProductImage(imgIdx, 'left')}
                                        className="p-1 text-[#8C3A5A] hover:text-[#C4436A] hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                        title="Move Left / Earlier"
                                      >
                                        <ArrowLeft className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={imgIdx === allImgs.length - 1}
                                        onClick={() => handleMoveProductImage(imgIdx, 'right')}
                                        className="p-1 text-[#8C3A5A] hover:text-[#C4436A] hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                        title="Move Right / Later"
                                      >
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                      {!isMain && (
                                        <button
                                          type="button"
                                          onClick={() => handleSetMainProductImage(imgIdx)}
                                          className="text-[9px] font-bold text-[#C4436A] hover:bg-white px-1.5 py-0.5 rounded-md cursor-pointer"
                                          title="Set as Main Cover Image"
                                        >
                                          Set Main
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProductImage(imgIdx)}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-white rounded-md cursor-pointer"
                                        title="Delete this image"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {/* Image Upload Inputs (File + CDN URL) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <label className="p-3 bg-white border-2 border-dashed border-[#F5B8CE] hover:border-[#C4436A] rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
                          <Upload className="w-4 h-4 text-[#C4436A]" />
                          <span className="font-bold text-[#C4436A] text-xs">Browse &amp; Upload Photo</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newImageUrlInput}
                            onChange={(e) => setNewImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddProductImageUrl();
                              }
                            }}
                            placeholder="Or paste external CDN Image URL..."
                            className="flex-1 p-2 rounded-xl border border-[#F5D0DF] bg-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddProductImageUrl}
                            className="btn-tinkle px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
                          >
                            + Add URL
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* VARIANTS MATRIX & GENERATOR */}
                    <div className="p-4 sm:p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F7D8E4] pb-3">
                        <div>
                          <label className="font-bold text-[#3D2C35] flex items-center gap-1.5 text-xs">
                            <Layers className="w-4 h-4 text-[#C4436A]" />
                            <span>Product Variants &amp; Combinations Matrix</span>
                          </label>
                          <span className="text-[11px] text-[#7A6370]">Generate size × color combinations or customize each variant with individual pricing and photos.</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {productForm.variants && productForm.variants.length > 0 && (
                            <div className="flex bg-white rounded-xl p-0.5 border border-[#F5D0DF]">
                              <button
                                type="button"
                                onClick={() => setVariantViewMode('card')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                  variantViewMode === 'card' ? 'bg-[#C4436A] text-white' : 'text-[#7A6370] hover:text-black'
                                }`}
                              >
                                <span>Card View</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setVariantViewMode('grid')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                  variantViewMode === 'grid' ? 'bg-[#C4436A] text-white' : 'text-[#7A6370] hover:text-black'
                                }`}
                              >
                                <span>All Grid</span>
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleAddVariant}
                            className="btn-tinkle text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Custom Variant</span>
                          </button>
                        </div>
                      </div>

                      {/* Fast Cross Matrix Generator (Sizes × Colors) */}
                      <div className="p-3.5 bg-white rounded-2xl border border-[#FAD2E2] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#8C3A5A] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Quick Matrix Generator (e.g. 3 sizes × 2 colors = 6 variant cards)</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-[#7A6370] block mb-1">
                              Sizes (comma separated)
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={matrixSizes}
                                onChange={(e) => setMatrixSizes(e.target.value)}
                                placeholder="e.g. Free Size, S, M, L"
                                className="flex-1 p-2 rounded-xl border border-[#F5D0DF] text-xs bg-[#FFF9FB]"
                              />
                              <button
                                type="button"
                                onClick={() => setMatrixSizes('Free Size, S, M, L')}
                                className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg font-bold text-gray-700 whitespace-nowrap cursor-pointer"
                              >
                                + Sizes Preset
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-[#7A6370] block mb-1">
                              Colors / Metal Finishes (comma separated)
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={matrixColors}
                                onChange={(e) => setMatrixColors(e.target.value)}
                                placeholder="e.g. 18k Gold, Rose Gold, Silver"
                                className="flex-1 p-2 rounded-xl border border-[#F5D0DF] text-xs bg-[#FFF9FB]"
                              />
                              <button
                                type="button"
                                onClick={() => setMatrixColors('18k Gold, Rose Gold, Silver')}
                                className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg font-bold text-gray-700 whitespace-nowrap cursor-pointer"
                              >
                                + Colors Preset
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGenerateMatrix}
                          className="w-full btn-tinkle-outline py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#C4436A]" />
                          <span>Generate &amp; Cross-Combine Matrix Cards</span>
                        </button>
                      </div>

                      {/* VARIANTS DISPLAY & CARD-BY-CARD NAVIGATION */}
                      {productForm.variants && productForm.variants.length > 0 ? (
                        <div className="space-y-4">
                          {/* Variant Carousel Tabs Selector */}
                          <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-[#FCE1EB]">
                            <button
                              type="button"
                              disabled={focusedVariantIndex <= 0}
                              onClick={() => setFocusedVariantIndex((prev) => Math.max(0, prev - 1))}
                              className="p-2 rounded-xl bg-[#FFF0F5] text-[#C4436A] hover:bg-[#FBE6EF] disabled:opacity-30 disabled:hover:bg-[#FFF0F5] cursor-pointer transition-colors"
                              title="Previous Variant Card"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Pill Switcher */}
                            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 flex-1 justify-center">
                              {productForm.variants.map((v, vIdx) => {
                                const isFocused = vIdx === focusedVariantIndex;
                                return (
                                  <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => setFocusedVariantIndex(vIdx)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                      isFocused
                                        ? 'bg-[#C4436A] text-white shadow-sm'
                                        : 'bg-[#FFF9FB] text-[#7A6370] hover:bg-[#FCE1EB] hover:text-[#C4436A]'
                                    }`}
                                  >
                                    {v.attributes?.hex && (
                                      <span
                                        className="w-2.5 h-2.5 rounded-full border border-white"
                                        style={{ backgroundColor: v.attributes.hex }}
                                      />
                                    )}
                                    <span>{v.name || `Var #${vIdx + 1}`}</span>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              disabled={focusedVariantIndex >= productForm.variants.length - 1}
                              onClick={() => setFocusedVariantIndex((prev) => Math.min(productForm.variants.length - 1, prev + 1))}
                              className="p-2 rounded-xl bg-[#FFF0F5] text-[#C4436A] hover:bg-[#FBE6EF] disabled:opacity-30 disabled:hover:bg-[#FFF0F5] cursor-pointer transition-colors"
                              title="Next Variant Card"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Render Variant Cards: Either Single Focused Card or Grid */}
                          {(variantViewMode === 'card'
                            ? [productForm.variants[focusedVariantIndex] || productForm.variants[0]]
                            : productForm.variants
                          ).map((v) => {
                            if (!v) return null;
                            const vIndex = productForm.variants.findIndex((item) => item.id === v.id);

                            return (
                              <div
                                key={v.id}
                                className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-[#FCE1EB] space-y-4 shadow-sm relative animate-in fade-in duration-200"
                              >
                                <div className="flex items-center justify-between border-b border-[#F7D8E4] pb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-xl bg-[#FFF0F5] text-[#C4436A] font-bold text-xs flex items-center justify-center">
                                      #{vIndex + 1}
                                    </span>
                                    <div>
                                      <h4 className="font-bold text-sm text-[#241A20]">{v.name || `Variant #${vIndex + 1}`}</h4>
                                      <span className="text-[10px] font-mono text-[#8C7582]">{v.sku}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copy = {
                                          ...v,
                                          id: 'var_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                                          name: `${v.name} (Copy)`,
                                          sku: `${v.sku}-CPY`,
                                        };
                                        setProductForm((prev) => ({
                                          ...prev,
                                          variants: [...(prev.variants || []), copy],
                                        }));
                                        setFocusedVariantIndex(productForm.variants.length);
                                      }}
                                      className="text-xs text-[#7A6370] hover:text-[#C4436A] font-semibold flex items-center gap-1 cursor-pointer bg-gray-50 px-2.5 py-1 rounded-lg"
                                      title="Duplicate Variant"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Duplicate</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariant(v.id)}
                                      className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                  <div className="sm:col-span-2">
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Variant Title / Option Name *</label>
                                    <input
                                      type="text"
                                      value={v.name}
                                      onChange={(e) => handleUpdateVariant(v.id, { name: e.target.value })}
                                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-medium"
                                      placeholder="e.g. 18k Rose Gold / Size 7"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Variant SKU Code *</label>
                                    <input
                                      type="text"
                                      value={v.sku}
                                      onChange={(e) => handleUpdateVariant(v.id, { sku: e.target.value })}
                                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Variant Selling Price (₹) *</label>
                                    <input
                                      type="number"
                                      value={v.price}
                                      onChange={(e) => handleUpdateVariant(v.id, { price: Number(e.target.value) })}
                                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-bold text-[#C4436A]"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                  <div>
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Compare / Sale Price (₹)</label>
                                    <input
                                      type="number"
                                      value={v.salePrice || ''}
                                      onChange={(e) => handleUpdateVariant(v.id, { salePrice: e.target.value ? Number(e.target.value) : undefined })}
                                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                                      placeholder="e.g. 1299"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Inventory Units in Stock *</label>
                                    <input
                                      type="number"
                                      value={v.stock}
                                      onChange={(e) => handleUpdateVariant(v.id, { stock: Number(e.target.value) })}
                                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Color Finish</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="text"
                                        value={v.attributes?.color || ''}
                                        onChange={(e) =>
                                          handleUpdateVariant(v.id, {
                                            attributes: { ...v.attributes, color: e.target.value },
                                          })
                                        }
                                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                                        placeholder="e.g. Rose Gold"
                                      />
                                      {v.attributes?.hex && (
                                        <span
                                          className="w-8 h-8 rounded-xl border border-gray-300 flex-shrink-0"
                                          style={{ backgroundColor: v.attributes.hex }}
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold block mb-1 text-[#7A6370]">Size Tag</label>
                                    <input
                                      type="text"
                                      value={v.attributes?.size || ''}
                                      onChange={(e) =>
                                        handleUpdateVariant(v.id, {
                                          attributes: { ...v.attributes, size: e.target.value },
                                        })
                                      }
                                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                                      placeholder="e.g. Size 7, M, Standard"
                                    />
                                  </div>
                                </div>

                                {/* MULTIPLE IMAGES FOR THIS SPECIFIC VARIANT */}
                                <div className="p-3.5 bg-[#FFF9FB] rounded-2xl border border-[#FCE1EB] space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-[#8C3A5A] flex items-center gap-1.5">
                                      <ImageIcon className="w-3.5 h-3.5 text-[#C4436A]" />
                                      <span>Variant Specific Photo Gallery ({v.images?.length || 0} images)</span>
                                    </label>
                                    <span className="text-[10px] text-[#7A6370]">If empty, uses main product photo</span>
                                  </div>

                                  {/* Existing Images in this Variant */}
                                  {v.images && v.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                      {v.images.map((vImg, vImgIdx) => (
                                        <div
                                          key={vImgIdx}
                                          className={`relative group rounded-xl overflow-hidden border-2 bg-white ${
                                            vImgIdx === 0 ? 'border-[#C4436A]' : 'border-[#F5D0DF]'
                                          }`}
                                        >
                                          {vImgIdx === 0 && (
                                            <span className="absolute top-1 left-1 bg-[#C4436A] text-white text-[8px] font-bold px-1 rounded-sm z-10">
                                              COVER
                                            </span>
                                          )}
                                          <img
                                            src={vImg}
                                            alt="Variant"
                                            className="w-full h-20 object-cover"
                                          />
                                          <div className="p-1 bg-[#FFF0F5] flex items-center justify-between">
                                            <div className="flex items-center gap-0.5">
                                              <button
                                                type="button"
                                                disabled={vImgIdx === 0}
                                                onClick={() => handleVariantMoveImage(v.id, vImgIdx, 'left')}
                                                className="p-0.5 text-[#8C3A5A] hover:bg-white rounded-sm disabled:opacity-20 cursor-pointer"
                                                title="Move Left"
                                              >
                                                <ArrowLeft className="w-2.5 h-2.5" />
                                              </button>
                                              <button
                                                type="button"
                                                disabled={vImgIdx === v.images!.length - 1}
                                                onClick={() => handleVariantMoveImage(v.id, vImgIdx, 'right')}
                                                className="p-0.5 text-[#8C3A5A] hover:bg-white rounded-sm disabled:opacity-20 cursor-pointer"
                                                title="Move Right"
                                              >
                                                <ArrowRight className="w-2.5 h-2.5" />
                                              </button>
                                            </div>

                                            <div className="flex items-center gap-0.5">
                                              {vImgIdx > 0 && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleVariantSetMainImage(v.id, vImgIdx)}
                                                  className="text-[8px] font-bold text-[#C4436A] hover:bg-white px-1 rounded-sm cursor-pointer"
                                                >
                                                  Set Main
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => handleVariantRemoveImage(v.id, vImgIdx)}
                                                className="p-0.5 text-red-500 hover:text-red-700 cursor-pointer"
                                                title="Remove photo"
                                              >
                                                <Trash2 className="w-2.5 h-2.5" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add Image for this Variant */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    <label className="p-2 bg-white border border-dashed border-[#F5B8CE] hover:border-[#C4436A] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all">
                                      <Upload className="w-3.5 h-3.5 text-[#C4436A]" />
                                      <span className="font-bold text-[#C4436A] text-[11px]">Upload Variant Photo</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleVariantFileUpload(v.id, e)}
                                        className="hidden"
                                      />
                                    </label>

                                    <div className="flex gap-1.5">
                                      <input
                                        type="url"
                                        id={`var-url-input-${v.id}`}
                                        placeholder="Or paste image URL..."
                                        className="flex-1 p-2 rounded-xl border border-[#F5D0DF] bg-white text-[11px]"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const input = document.getElementById(`var-url-input-${v.id}`) as HTMLInputElement;
                                            if (input && input.value) {
                                              handleVariantAddImageUrl(v.id, input.value);
                                              input.value = '';
                                            }
                                          }
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.getElementById(`var-url-input-${v.id}`) as HTMLInputElement;
                                          if (input && input.value) {
                                            handleVariantAddImageUrl(v.id, input.value);
                                            input.value = '';
                                          }
                                        }}
                                        className="btn-tinkle px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer"
                                      >
                                        + Add
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#8C7582] italic text-center py-4 bg-white rounded-2xl border border-[#FAD2E2]">
                          No variants added yet. Use the Quick Matrix Generator above or click "+ Custom Variant" to create variants.
                        </p>
                      )}
                    </div>

                    {/* Highlights & In-Depth Specs */}
                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Short Description (Catchphrase)</label>
                        <input
                          type="text"
                          value={productForm.shortDescription}
                          onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                          placeholder="18k gold-plated dainty heart solitaire pendant..."
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Full Detailed Story &amp; Description</label>
                        <textarea
                          rows={3}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                          placeholder="Write about the craftsmanship, materials, aesthetic mood..."
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#3D2C35] block mb-1">Material &amp; Care Guide</label>
                        <input
                          type="text"
                          value={productForm.careInstructions}
                          onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3 border-t border-[#F7D8E4]">
                      <button
                        type="submit"
                        className="flex-1 btn-tinkle font-bold text-xs tracking-wider uppercase py-3 rounded-xl shadow-md cursor-pointer"
                      >
                        {editingProductId ? 'SAVE PRODUCT & VARIANTS' : 'PUBLISH PRODUCT & VARIANTS'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-5 py-3 rounded-xl border border-gray-300 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES & MULTI-LEVEL TREE HIERARCHY */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Category Tree Display */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F7D8E4] pb-3">
                  <div>
                    <h3 className="font-display text-lg text-[#241A20]">Active Taxonomy Hierarchy</h3>
                    <p className="text-xs text-[#7A6370]">Main Categories &rarr; Subcategories &rarr; Nested Types</p>
                  </div>
                  <span className="text-xs font-bold text-[#C4436A] bg-[#FFF0F5] px-3 py-1 rounded-full">
                    {categories.length} Root Lines
                  </span>
                </div>

                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover border border-[#F7D8E4]" />
                          <div>
                            {editingCategory?.categoryId === cat.id ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    className="p-1 text-sm font-bold border border-[#F5D0DF] rounded-lg bg-white"
                                    placeholder="Category Name"
                                  />
                                  <button
                                    onClick={() => {
                                      if (editingCategory.name.trim()) {
                                        updateCategory(cat.id, {
                                          name: editingCategory.name.trim(),
                                          slug: editingCategory.name.trim().toLowerCase().replace(/\s+/g, '-'),
                                          image: editingCategory.image || cat.image,
                                        });
                                      }
                                      setEditingCategory(null);
                                    }}
                                    className="px-2.5 py-1 text-xs bg-[#C4436A] text-white rounded-lg font-bold cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCategory(null)}
                                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <input
                                    type="text"
                                    value={editingCategory.image}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                                    className="p-1 text-xs border border-[#F5D0DF] rounded-lg bg-white w-full"
                                    placeholder="Image URL"
                                  />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-sm text-[#241A20] flex items-center gap-1.5">
                                  <span>{cat.name}</span>
                                  {!cat.isActive && cat.isActive !== undefined && (
                                    <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm">HIDDEN</span>
                                  )}
                                  <button
                                    onClick={() => setEditingCategory({ categoryId: cat.id, name: cat.name, slug: cat.slug, image: cat.image })}
                                    className="p-1 text-[#8C7582] hover:text-[#C4436A] rounded-md cursor-pointer"
                                    title="Edit Main Category Name & Image"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </h4>
                                <span className="text-[10px] text-[#8C7582]">slug: /{cat.slug} &bull; {cat.itemCount} items</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              updateCategory(cat.id, { isActive: cat.isActive === false ? true : false });
                            }}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors ${cat.isActive !== false ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            title={cat.isActive !== false ? "Hide from Storefront" : "Show on Storefront"}
                          >
                            {cat.isActive !== false ? 'Visible' : 'Hidden'}
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialogState({
                                isOpen: true,
                                title: 'Delete Root Category',
                                message: `Are you sure you want to delete category "${cat.name}" and all its subcategories? This cannot be undone.`,
                                confirmText: 'Delete Category',
                                onConfirm: () => deleteCategory(cat.id),
                              });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      <div className="pl-4 border-l-2 border-[#F5D0DF] space-y-2">
                        {cat.subcategories?.map((sub) => (
                          <div key={sub.id} className="p-3 bg-white rounded-xl border border-[#FCE1EB] space-y-2">
                            <div className="flex items-center justify-between">
                              {editingSubcategory?.categoryId === cat.id && editingSubcategory?.subcategoryId === sub.id ? (
                                <div className="flex items-center gap-2 flex-1 mr-2">
                                  <input
                                    type="text"
                                    value={editingSubcategory.name}
                                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })}
                                    className="p-1 text-xs font-bold border border-[#F5D0DF] rounded-lg bg-white flex-1"
                                  />
                                  <button
                                    onClick={() => {
                                      if (editingSubcategory.name.trim()) {
                                        updateSubcategory(cat.id, sub.id, {
                                          name: editingSubcategory.name.trim(),
                                          slug: editingSubcategory.name.trim().toLowerCase().replace(/\s+/g, '-'),
                                        });
                                      }
                                      setEditingSubcategory(null);
                                    }}
                                    className="px-2 py-1 text-[11px] bg-[#C4436A] text-white rounded-lg font-bold cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingSubcategory(null)}
                                    className="px-2 py-1 text-[11px] bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span className="font-semibold text-xs text-[#C4436A] flex items-center gap-1.5">
                                  <ChevronRight className="w-3.5 h-3.5" />
                                  <span>{sub.name}</span>
                                  <button
                                    onClick={() => setEditingSubcategory({ categoryId: cat.id, subcategoryId: sub.id, name: sub.name })}
                                    className="p-0.5 text-[#8C7582] hover:text-[#C4436A] rounded-md cursor-pointer ml-1"
                                    title="Edit Subcategory Name"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  setConfirmDialogState({
                                    isOpen: true,
                                    title: 'Remove Subcategory',
                                    message: `Are you sure you want to remove "${sub.name}" from ${cat.name}?`,
                                    confirmText: 'Remove Subcategory',
                                    onConfirm: () => deleteSubcategory(cat.id, sub.id),
                                  });
                                }}
                                className="text-[11px] text-red-400 hover:text-red-600 font-medium cursor-pointer"
                              >
                                remove
                              </button>
                            </div>

                            {/* Nested Subcategories */}
                            {sub.nestedSubcategories && sub.nestedSubcategories.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pl-5 pt-1">
                                {sub.nestedSubcategories.map((nested) => (
                                  <div key={nested.id} className="flex items-center gap-1 text-[11px] bg-[#FFF0F5] border border-[#FAD2E2] text-[#7A6370] px-2 py-0.5 rounded-lg">
                                    {editingNestedSubcategory?.categoryId === cat.id && editingNestedSubcategory?.subcategoryId === sub.id && editingNestedSubcategory?.nestedId === nested.id ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="text"
                                          value={editingNestedSubcategory.name}
                                          onChange={(e) => setEditingNestedSubcategory({ ...editingNestedSubcategory, name: e.target.value })}
                                          className="p-0.5 text-[10px] w-20 border border-[#F5D0DF] rounded-md bg-white"
                                        />
                                        <button
                                          onClick={() => {
                                            if (editingNestedSubcategory.name.trim()) {
                                              updateNestedSubcategory(cat.id, sub.id, nested.id, {
                                                name: editingNestedSubcategory.name.trim(),
                                                slug: editingNestedSubcategory.name.trim().toLowerCase().replace(/\s+/g, '-'),
                                              });
                                            }
                                            setEditingNestedSubcategory(null);
                                          }}
                                          className="text-[10px] text-[#C4436A] font-bold cursor-pointer"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          onClick={() => setEditingNestedSubcategory(null)}
                                          className="text-[10px] text-gray-500 cursor-pointer"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <span>&bull; {nested.name}</span>
                                        <button
                                          onClick={() => setEditingNestedSubcategory({ categoryId: cat.id, subcategoryId: sub.id, nestedId: nested.id, name: nested.name })}
                                          className="text-[#8C7582] hover:text-[#C4436A] ml-0.5 cursor-pointer"
                                          title="Edit Nested Tag"
                                        >
                                          <Edit2 className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setConfirmDialogState({
                                              isOpen: true,
                                              title: 'Delete Nested Tag',
                                              message: `Delete tag "${nested.name}"?`,
                                              confirmText: 'Delete Tag',
                                              onConfirm: () => deleteNestedSubcategory(cat.id, sub.id, nested.id),
                                            });
                                          }}
                                          className="text-red-400 hover:text-red-600 ml-0.5 cursor-pointer"
                                          title="Delete Nested Tag"
                                        >
                                          &times;
                                        </button>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Category / Subcategory / Nested Form */}
              <div className="bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-5 h-fit">
                <div>
                  <h3 className="font-display text-base text-[#241A20]">Category Hierarchy Builder</h3>
                  <p className="text-xs text-[#7A6370]">Add root categories, subcategories, or nested tags</p>
                </div>

                {/* 1. Main Category Creator */}
                <div className="space-y-2 pt-2 border-t border-[#F7D8E4] text-xs">
                  <span className="font-bold text-[#8C3A5A] uppercase tracking-wider block">1. Add New Main Category Line</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => {
                        setNewCatName(e.target.value);
                        setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }}
                      className="p-2 rounded-xl border border-[#F5D0DF]"
                      placeholder="e.g. Footwear, Perfumes"
                    />
                    <input
                      type="text"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      className="p-2 rounded-xl border border-[#F5D0DF]"
                      placeholder="Cover Image URL (optional)"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newCatName.trim()) return;
                      const catId = newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-');
                      addCategory({
                        id: catId,
                        name: newCatName.trim(),
                        slug: catId,
                        description: newCatDesc || `${newCatName} curated collection`,
                        image: newCatImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
                        itemCount: 0,
                        subcategories: [],
                      });
                      setNewCatName('');
                      setNewCatSlug('');
                      setNewCatImage('');
                      confetti({ particleCount: 25, spread: 40 });
                    }}
                    className="w-full btn-tinkle py-2 rounded-xl font-bold cursor-pointer"
                  >
                    + Create Main Category
                  </button>
                </div>

                {/* 2. Subcategory Creator */}
                <div className="space-y-3 pt-3 border-t border-[#F7D8E4] text-xs">
                  <span className="font-bold text-[#8C3A5A] uppercase tracking-wider block">2. Add Subcategory Under Category</span>
                  <div>
                    <label className="font-semibold block mb-1">Target Main Category</label>
                    <select
                      value={selectedCatForSub}
                      onChange={(e) => setSelectedCatForSub(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white capitalize"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">New Subcategory Title</label>
                    <input
                      type="text"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                      placeholder="e.g. Velvet Chokers, Midi Rings"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newSubName.trim()) return;
                      const slug = newSubName.trim().toLowerCase().replace(/\s+/g, '-');
                      addSubcategory(selectedCatForSub, {
                        id: 'sub_' + Date.now(),
                        name: newSubName.trim(),
                        slug,
                        itemCount: 0,
                        nestedSubcategories: [],
                      });
                      setNewSubName('');
                      confetti({ particleCount: 25, spread: 40 });
                    }}
                    className="w-full btn-tinkle-outline py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    + Add Subcategory
                  </button>
                </div>

                {/* 3. Nested Subcategory Creator */}
                <div className="space-y-3 pt-3 border-t border-[#F7D8E4] text-xs">
                  <span className="font-bold text-[#8C3A5A] uppercase tracking-wider block">3. Add Nested Type Under Subcategory</span>
                  
                  <div>
                    <label className="font-semibold block mb-1">Target Main Category</label>
                    <select
                      value={selectedCatForNested}
                      onChange={(e) => {
                        const newCatId = e.target.value;
                        setSelectedCatForNested(newCatId);
                        const catObj = categories.find((c) => c.id === newCatId);
                        if (catObj && catObj.subcategories.length > 0) {
                          setSelectedSubForNested(catObj.subcategories[0].id);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white capitalize"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const activeCatObj = categories.find((c) => c.id === selectedCatForNested) || categories[0];
                    const activeSubs = activeCatObj?.subcategories || [];

                    return (
                      <div>
                        <label className="font-semibold block mb-1">Target Subcategory</label>
                        {activeSubs.length > 0 ? (
                          <select
                            value={selectedSubForNested}
                            onChange={(e) => setSelectedSubForNested(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                          >
                            {activeSubs.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-[11px] text-red-500 italic p-2 bg-red-50 rounded-xl">Please add a subcategory under {activeCatObj?.name} first.</p>
                        )}
                      </div>
                    );
                  })()}

                  <div>
                    <label className="font-semibold block mb-1">New Nested Type Name</label>
                    <input
                      type="text"
                      value={newNestedName}
                      onChange={(e) => setNewNestedName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                      placeholder="e.g. Huggie Hoops, Solitaire Studs"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newNestedName.trim()) return;
                      const slug = newNestedName.trim().toLowerCase().replace(/\s+/g, '-');
                      const parentCat = categories.find((c) => c.id === selectedCatForNested);
                      const targetSub = parentCat?.subcategories.find((s) => s.id === selectedSubForNested) || parentCat?.subcategories[0];
                      
                      if (targetSub) {
                        addNestedSubcategory(selectedCatForNested, targetSub.id, {
                          id: 'nest_' + Date.now(),
                          name: newNestedName.trim(),
                          slug,
                          itemCount: 0,
                        });
                        setNewNestedName('');
                        confetti({ particleCount: 25, spread: 40 });
                      }
                    }}
                    className="w-full btn-tinkle py-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    + Add Nested Type
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & INVOICES */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#FBE6EF] shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-[#F7D8E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-[#241A20]">Customer Orders Pipeline</h3>
                  <p className="text-xs text-[#7A6370]">Click any order or "Expand" to inspect selected variants, track items, update delivery stages &amp; trigger email confirmations.</p>
                </div>
                <span className="text-xs font-bold text-[#C4436A] bg-[#FFF0F5] px-3.5 py-1.5 rounded-full w-fit">
                  {orders.length} Total Orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF0F5] text-[#8C3A5A] font-bold border-b border-[#F7D8E4]">
                    <tr>
                      <th className="p-4">Order # &amp; Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items &amp; Variants Selected</th>
                      <th className="p-4">Grand Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FDF0F5]">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#7A6370] italic">
                          No orders placed yet. Orders from storefront checkout will appear here with full variant tracking.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr
                          key={ord.id}
                          className="hover:bg-[#FFF9FB] transition-colors cursor-pointer group"
                          onClick={() => setSelectedOrderForDetail(ord)}
                        >
                          <td className="p-4 font-mono">
                            <strong className="text-[#C4436A] block text-xs group-hover:underline">{ord.orderNumber}</strong>
                            <span className="text-[10px] text-[#8C7582]">{ord.createdAt}</span>
                          </td>

                          <td className="p-4">
                            <strong className="text-[#241A20] block">{ord.customerName}</strong>
                            <span className="text-[10px] text-[#8C7582]">{ord.customerPhone}</span>
                            <span className="text-[10px] text-[#7A6370] block truncate max-w-[150px]">
                              {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="text-[11px] space-y-1 max-w-[220px]">
                              {(ord.items || []).map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 truncate">
                                  {it.image && (
                                    <img src={it.image} alt={it.productName} className="w-5 h-5 rounded-md object-cover flex-shrink-0" />
                                  )}
                                  <div className="truncate">
                                    <span className="font-medium text-[#241A20]">{it.productName}</span>
                                    <span className="text-[10px] font-bold text-[#C4436A] ml-1">×{it.quantity}</span>
                                    {it.variantInfo && (
                                      <span className="block text-[10px] text-[#8C7582] font-mono">
                                        [{it.variantInfo}]
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="p-4 font-bold text-[#C4436A]">
                            ₹{(ord.grandTotal || 0).toLocaleString()}
                          </td>

                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                              ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.paymentStatus} ({ord.paymentMethod})
                            </span>
                          </td>

                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                              className="text-xs p-1.5 rounded-lg border border-[#F5D0DF] bg-white font-semibold text-[#8C3A5A] cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="packed">Packed</option>
                              <option value="shipped">Shipped</option>
                              <option value="out_for_delivery">Out For Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderForDetail(ord)}
                                className="px-2.5 py-1.5 bg-[#FFF0F5] hover:bg-[#C4436A] text-[#C4436A] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Expand Details & Variants"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Expand</span>
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmDialogState({
                                    isOpen: true,
                                    title: 'Delete Order Record',
                                    message: `Are you sure you want to delete order ${ord.orderNumber} for ${ord.customerName}?`,
                                    confirmText: 'Delete Order',
                                    onConfirm: () => deleteOrder(ord.id),
                                  });
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS & REPEAT BUYER COHORTS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs">
                <span className="text-xs text-[#7A6370]">Total Registered Accounts</span>
                <p className="text-2xl font-bold text-[#241A20] font-sans">{customers.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs">
                <span className="text-xs text-[#7A6370]">Repeat Buyers</span>
                <p className="text-2xl font-bold text-emerald-700 font-sans">{repeatBuyersCount}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#FBE6EF] shadow-xs">
                <span className="text-xs text-[#7A6370]">Average Lifetime Value</span>
                <p className="text-2xl font-bold text-[#C4436A] font-sans">
                  ₹{Math.round(customers.reduce((s, c) => s + (c.totalSpent || 0), 0) / (customers.length || 1)).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#FBE6EF] shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-[#F7D8E4] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg text-[#241A20]">Registered Customers &amp; Cohorts</h3>
                  <p className="text-xs text-[#7A6370]">Click on any customer to inspect order history, change statuses or send emails</p>
                </div>
                <span className="text-xs font-bold text-[#C4436A] bg-[#FFF0F5] px-3 py-1.5 rounded-full">
                  {customers.length} Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF0F5] text-[#8C3A5A] font-bold border-b border-[#F7D8E4]">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Total Orders</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4">Cohort Status</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FDF0F5]">
                    {customers.map((c) => (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCustomerForOrders(c)}
                        className="hover:bg-[#FFF9FB] transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            {c.avatar ? (
                              <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover border" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#C4436A] font-bold flex items-center justify-center">
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <strong className="text-xs text-[#241A20] block">{c.name}</strong>
                              <span className="text-[10px] text-[#8C7582]">@{c.username}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="text-xs block font-medium">{c.email}</span>
                          <span className="text-[10px] text-[#8C7582]">{c.phone}</span>
                        </td>

                        <td className="p-4 font-bold text-[#241A20]">
                          {c.totalOrders} orders
                        </td>

                        <td className="p-4 font-bold text-[#C4436A]">
                          ₹{(c.totalSpent || 0).toLocaleString()}
                        </td>

                        <td className="p-4">
                          {c.isRepeatCustomer ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Repeat VIP (Loyal)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                              New Customer
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-[#8C7582]">
                          {c.joinedDate}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomerForOrders(c);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#FFF0F5] text-[#C4436A] font-bold text-xs hover:bg-[#C4436A] hover:text-white transition-colors cursor-pointer"
                          >
                            Manage User &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CUSTOMER INSPECTOR & ORDER MANAGEMENT MODAL */}
            {selectedCustomerForOrders && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                <div className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-[#FBE6EF] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#F7D8E4] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#C4436A] font-bold text-lg flex items-center justify-center border border-[#F5D0DF]">
                        {selectedCustomerForOrders.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-[#241A20]">{selectedCustomerForOrders.name}</h3>
                        <p className="text-xs text-[#7A6370]">@{selectedCustomerForOrders.username} &bull; {selectedCustomerForOrders.email} &bull; {selectedCustomerForOrders.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCustomerForOrders(null);
                        setEmailSendSuccess(false);
                      }}
                      className="p-2 text-[#8C7582] hover:text-black rounded-xl text-xl cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Customer Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF]">
                      <span className="text-[#7A6370] block">Lifetime Value</span>
                      <strong className="text-base text-[#C4436A] font-bold">₹{(selectedCustomerForOrders.totalSpent || 0).toLocaleString()}</strong>
                    </div>
                    <div className="p-3 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF]">
                      <span className="text-[#7A6370] block">Total Orders</span>
                      <strong className="text-base text-[#241A20] font-bold">{selectedCustomerForOrders.totalOrders} Orders</strong>
                    </div>
                    <div className="p-3 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF]">
                      <span className="text-[#7A6370] block">Customer Status</span>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCustomerForOrders.isRepeatCustomer ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                        {selectedCustomerForOrders.isRepeatCustomer ? '★ VIP Repeat' : 'New User'}
                      </span>
                    </div>
                    <div className="p-3 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF]">
                      <span className="text-[#7A6370] block">Joined On</span>
                      <strong className="text-xs text-[#241A20] block mt-1">{selectedCustomerForOrders.joinedDate}</strong>
                    </div>
                  </div>

                  {/* Orders History & Order Status / Payment Changer */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-[#241A20] flex items-center justify-between">
                      <span>Customer's Placed Orders ({orders.filter((o) => o.customerEmail === selectedCustomerForOrders.email || o.customerName.toLowerCase() === selectedCustomerForOrders.name.toLowerCase()).length})</span>
                      <span className="text-[11px] text-[#7A6370] font-normal">Change status or verify payment</span>
                    </h4>

                    {(() => {
                      const userOrders = orders.filter(
                        (o) => o.customerEmail === selectedCustomerForOrders.email || o.customerName.toLowerCase() === selectedCustomerForOrders.name.toLowerCase()
                      );

                      if (userOrders.length === 0) {
                        return (
                          <div className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] text-center text-xs text-[#7A6370]">
                            No placed orders recorded for this user yet.
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          {userOrders.map((ord) => (
                            <div key={ord.id} className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FCE1EB] space-y-3 text-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F7D8E4] pb-2">
                                <div>
                                  <strong className="text-[#C4436A] font-mono block text-sm">{ord.orderNumber}</strong>
                                  <span className="text-[11px] text-[#8C7582]">{ord.createdAt} &bull; Total: ₹{(ord.grandTotal || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Order Status Selector */}
                                  <div>
                                    <span className="text-[10px] text-[#7A6370] block font-semibold">Delivery Status:</span>
                                    <select
                                      value={ord.orderStatus}
                                      onChange={(e) => {
                                        updateOrderStatus(ord.id, e.target.value as any);
                                        confetti({ particleCount: 20, spread: 30 });
                                      }}
                                      className="p-1.5 rounded-xl border border-[#F5D0DF] bg-white font-bold text-xs"
                                    >
                                      <option value="pending">🟡 Pending</option>
                                      <option value="processing">⚙️ Processing</option>
                                      <option value="shipped">🚚 Shipped</option>
                                      <option value="delivered">✅ Delivered</option>
                                      <option value="cancelled">❌ Cancelled</option>
                                    </select>
                                  </div>

                                  {/* Payment Status Selector */}
                                  <div>
                                    <span className="text-[10px] text-[#7A6370] block font-semibold">Payment Status:</span>
                                    <select
                                      value={ord.paymentStatus}
                                      onChange={(e) => {
                                        updateOrderPaymentStatus(ord.id, e.target.value as any);
                                        confetti({ particleCount: 20, spread: 30 });
                                      }}
                                      className="p-1.5 rounded-xl border border-[#F5D0DF] bg-white font-bold text-xs"
                                    >
                                      <option value="pending">⏳ Pending</option>
                                      <option value="paid">💳 Paid</option>
                                      <option value="failed">⚠️ Failed</option>
                                      <option value="refunded">↩️ Refunded</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-1 mt-2">
                                {(ord.items || []).map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#FCE1EB] last:border-0">
                                    <div className="flex gap-2 items-center">
                                      {it.productImage && (
                                        <img src={it.productImage} alt={it.productName} className="w-8 h-8 rounded-md object-cover border border-[#F7D8E4]" />
                                      )}
                                      <div>
                                        <span className="text-[#3D2C35] font-semibold block">{it.productName}</span>
                                        {it.variantInfo && (
                                          <span className="text-[10px] text-[#7A6370] block">Variant: {it.variantInfo}</span>
                                        )}
                                        <span className="text-[10px] text-[#8C7582]">Qty: {it.quantity}</span>
                                      </div>
                                    </div>
                                    <span className="font-semibold text-[#241A20]">₹{((it.price * it.quantity) || 0).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Send Direct Email From Company */}
                  <div className="p-5 bg-[#FFF0F5] rounded-3xl border border-[#FAD2E2] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#8C3A5A] flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#C4436A]" />
                        <span>Send Official Email to Customer (From Studio Desk)</span>
                      </h4>
                      <span className="text-[11px] text-[#7A6370]">From: orders@tinklejewels.com</span>
                    </div>

                    {emailSendSuccess ? (
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                        <span>Email successfully dispatched from Tinkle Jewels mail server to {selectedCustomerForOrders.email}!</span>
                        <button onClick={() => setEmailSendSuccess(false)} className="text-xs underline font-bold cursor-pointer">Send another</button>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-semibold text-[#3D2C35] block mb-1">Subject Line</label>
                          <input
                            type="text"
                            value={customerEmailSubject}
                            onChange={(e) => setCustomerEmailSubject(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-[#3D2C35] block mb-1">Message Content</label>
                          <textarea
                            rows={3}
                            value={customerEmailBody}
                            onChange={(e) => setCustomerEmailBody(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                            placeholder="Write customer order update, dispatch information, or personalized note..."
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!customerEmailBody.trim()) return;
                            sendDirectCustomerEmail(selectedCustomerForOrders.email, customerEmailSubject, customerEmailBody);
                            setEmailSendSuccess(true);
                            setCustomerEmailBody('');
                            confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#E5C158'] });
                          }}
                          className="btn-tinkle w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Dispatch Email to {selectedCustomerForOrders.email}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#F7D8E4]">
                    <button
                      onClick={() => {
                        setSelectedCustomerForOrders(null);
                        setEmailSendSuccess(false);
                      }}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PAYMENT GATEWAYS CONFIGURATION */}
        {activeTab === 'gateways' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-6">
              <div>
                <h3 className="font-display text-lg text-[#241A20]">Payment Gateway Integration Matrix</h3>
                <p className="text-xs text-[#7A6370]">Configure UPI QR, Cash on Delivery, Bank Transfer, Razorpay and Stripe.</p>
              </div>

              {/* 1. Manual UPI QR Settings */}
              <div className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-5 h-5 text-[#C4436A]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#241A20]">Manual UPI QR (GPay, PhonePe, Paytm)</h4>
                      <span className="text-[11px] text-[#7A6370]">Direct 0% fee peer-to-peer customer payments</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentGateways.manualUpi.enabled}
                    onChange={(e) => updatePaymentGateways({
                      manualUpi: { ...paymentGateways.manualUpi, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#C4436A]"
                  />
                </div>

                {paymentGateways.manualUpi.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <label className="font-semibold block mb-1">UPI ID (VPA)</label>
                      <input
                        type="text"
                        value={paymentGateways.manualUpi.upiId}
                        onChange={(e) => updatePaymentGateways({
                          manualUpi: { ...paymentGateways.manualUpi, upiId: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Payee Business Name</label>
                      <input
                        type="text"
                        value={paymentGateways.manualUpi.payeeName}
                        onChange={(e) => updatePaymentGateways({
                          manualUpi: { ...paymentGateways.manualUpi, payeeName: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Cash on Delivery Settings */}
              <div className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#241A20]">Cash on Delivery (COD)</h4>
                    <span className="text-[11px] text-[#7A6370]">Enable doorstep cash collection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentGateways.cod.enabled}
                    onChange={(e) => updatePaymentGateways({
                      cod: { ...paymentGateways.cod, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#C4436A]"
                  />
                </div>

                {paymentGateways.cod.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                    <div>
                      <label className="font-semibold block mb-1">COD Handling Surcharge (₹)</label>
                      <input
                        type="number"
                        value={paymentGateways.cod.extraCharge}
                        onChange={(e) => updatePaymentGateways({
                          cod: { ...paymentGateways.cod, extraCharge: Number(e.target.value) }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Min Order Limit (₹)</label>
                      <input
                        type="number"
                        value={paymentGateways.cod.minOrderLimit}
                        onChange={(e) => updatePaymentGateways({
                          cod: { ...paymentGateways.cod, minOrderLimit: Number(e.target.value) }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Max Order Limit (₹)</label>
                      <input
                        type="number"
                        value={paymentGateways.cod.maxOrderLimit}
                        onChange={(e) => updatePaymentGateways({
                          cod: { ...paymentGateways.cod, maxOrderLimit: Number(e.target.value) }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Razorpay Gateway */}
              <div className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#241A20]">Razorpay (Cards, NetBanking, UPI)</h4>
                    <span className="text-[11px] text-[#7A6370]">Automated Indian payment processing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentGateways.razorpay.enabled}
                    onChange={(e) => updatePaymentGateways({
                      razorpay: { ...paymentGateways.razorpay, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#C4436A]"
                  />
                </div>

                {paymentGateways.razorpay.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <label className="font-semibold block mb-1">Key ID</label>
                      <input
                        type="text"
                        value={paymentGateways.razorpay.keyId}
                        onChange={(e) => updatePaymentGateways({
                          razorpay: { ...paymentGateways.razorpay, keyId: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Key Secret</label>
                      <input
                        type="password"
                        value={paymentGateways.razorpay.keySecret}
                        onChange={(e) => updatePaymentGateways({
                          razorpay: { ...paymentGateways.razorpay, keySecret: e.target.value }
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COUPONS & PROMOTIONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#FBE6EF]">
              <div>
                <h3 className="font-display text-lg text-[#241A20]">Discount Promo Codes</h3>
                <p className="text-xs text-[#7A6370]">Configure percentage or flat discounts with spend requirements</p>
              </div>
              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="btn-tinkle text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-5 bg-white rounded-3xl border border-[#FBE6EF] shadow-xs space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm bg-[#FFF0F5] border border-[#F5D0DF] px-3 py-1 rounded-xl text-[#C4436A]">
                      {c.code}
                    </span>
                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-bold text-sm text-[#241A20]">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                  </p>
                  <p className="text-xs text-[#7A6370]">{c.description}</p>

                  <div className="pt-2 border-t border-[#FDF0F5] text-[11px] text-[#8C7582] space-y-0.5">
                    <p>&bull; Min order value: <strong>₹{c.minOrderValue}</strong></p>
                    {c.maxDiscount && <p>&bull; Max discount cap: <strong>₹{c.maxDiscount}</strong></p>}
                    <p>&bull; Per user limit: <strong>{c.perUserLimit || 1} times</strong></p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Coupon Modal */}
            {isAddCouponOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#FBE6EF] shadow-2xl space-y-4">
                  <h3 className="font-display text-xl text-[#241A20]">Create Discount Promo Code</h3>
                  <form onSubmit={handleAddCouponSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Coupon Code (e.g. FESTIVE25) *</label>
                      <input
                        type="text"
                        required
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] font-mono uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block mb-1">Discount Type</label>
                        <select
                          value={couponForm.discountType}
                          onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Flat Amount (₹)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Discount Value *</label>
                        <input
                          type="number"
                          required
                          value={couponForm.discountValue}
                          onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block mb-1">Min Cart Spend (₹)</label>
                        <input
                          type="number"
                          value={couponForm.minOrderValue}
                          onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">Max Cap (₹)</label>
                        <input
                          type="number"
                          value={couponForm.maxDiscount}
                          onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Promo Description</label>
                      <input
                        type="text"
                        value={couponForm.description}
                        onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                        placeholder="Get 20% OFF on your order!"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 btn-tinkle py-3 rounded-xl font-bold">
                        Save Coupon
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddCouponOpen(false)}
                        className="px-4 py-3 rounded-xl border border-gray-300 font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: EMAIL BROADCASTS & HELPDESK */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Broadcast Composer */}
              <div className="bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <div>
                  <h3 className="font-display text-lg text-[#241A20]">Email Marketing Broadcast</h3>
                  <p className="text-xs text-[#7A6370]">Send new drop announcements or discounts to all registered users.</p>
                </div>

                <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Audience Segment</label>
                    <select
                      value={broadcastAudience}
                      onChange={(e) => setBroadcastAudience(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                    >
                      <option value="all_users">All Registered Customers ({customers.length} users)</option>
                      <option value="repeat_buyers">Repeat VIP Buyers ({repeatBuyersCount} users)</option>
                      <option value="newsletter_only">Newsletter Subscribers (2,450 emails)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Email Subject *</label>
                    <input
                      type="text"
                      required
                      value={broadcastSubject}
                      onChange={(e) => setBroadcastSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                      placeholder="🌸 FRESH DROPS: New Autumn Baroque Pearls!"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Email Body Content *</label>
                    <textarea
                      rows={4}
                      required
                      value={broadcastContent}
                      onChange={(e) => setBroadcastContent(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                      placeholder="Hey gorgeous! Enjoy 20% off with code TINKLE20 this weekend..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-tinkle py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Broadcast Campaign Now</span>
                  </button>
                </form>
              </div>

              {/* In-App Helpdesk & User Queries */}
              <div className="bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg text-[#241A20]">Customer Inquiries &amp; Helpdesk</h3>
                    <p className="text-xs text-[#7A6370]">User questions forwarded to <strong>{settings.forwardingEmail}</strong></p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    {tickets.filter((t) => t.status === 'pending').length} Pending
                  </span>
                </div>

                <div className="space-y-3 divide-y divide-[#FDF0F5] max-h-96 overflow-y-auto pr-1">
                  {tickets.map((tkt) => (
                    <div key={tkt.id} className="pt-3 first:pt-0 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#C4436A]">{tkt.ticketNumber} &bull; {tkt.customerName}</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          tkt.status === 'solved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tkt.status}
                        </span>
                      </div>

                      <p className="font-semibold text-[#241A20]">{tkt.subject}</p>
                      <p className="text-[#7A6370] bg-[#FFF9FB] p-2.5 rounded-xl border border-[#FCE1EB]">
                        "{tkt.message}"
                      </p>

                      {/* Reply Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type quick reply to customer..."
                          value={ticketReplyText[tkt.id] || ''}
                          onChange={(e) => setTicketReplyText({ ...ticketReplyText, [tkt.id]: e.target.value })}
                          className="flex-1 p-2 rounded-xl border border-[#F5D0DF]"
                        />
                        <button
                          onClick={() => {
                            if (!ticketReplyText[tkt.id]) return;
                            replyToTicket(tkt.id, ticketReplyText[tkt.id]);
                            updateTicketStatus(tkt.id, 'solved');
                            setTicketReplyText({ ...ticketReplyText, [tkt.id]: '' });
                          }}
                          className="btn-tinkle px-3 py-2 rounded-xl font-bold cursor-pointer"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => updateTicketStatus(tkt.id, tkt.status === 'solved' ? 'pending' : 'solved')}
                          className="px-2.5 py-2 rounded-xl border border-gray-300 font-bold"
                          title="Toggle Solved Status"
                        >
                          {tkt.status === 'solved' ? 'Reopen' : 'Mark Solved'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: STORE SETTINGS & SECURITY */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-6 rounded-3xl border border-[#FBE6EF] shadow-xs space-y-6">
              <div>
                <h3 className="font-display text-lg text-[#241A20]">Storefront &amp; Security Settings</h3>
                <p className="text-xs text-[#7A6370]">Configure OTP verification, admin credentials, manual QR payment, and social proof tools.</p>
              </div>

              {/* Security & OTP Verification Policy */}
              <div className="p-5 bg-gradient-to-r from-[#FFF0F5] to-[#FBE6EF] rounded-2xl border border-[#F7D8E4] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C4436A]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#241A20]">Customer Email OTP Verification Requirement</h4>
                      <span className="text-[11px] text-[#7A6370]">Toggle whether customers MUST verify email OTP during registration &amp; login</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireEmailOtpVerification ?? false}
                    onChange={(e) => updateSettings({ requireEmailOtpVerification: e.target.checked })}
                    className="w-5 h-5 accent-[#C4436A] cursor-pointer"
                  />
                </div>

                <p className="text-[11px] text-[#7A6370]">
                  When <strong>ON</strong>, customer accounts will require a 6-digit OTP code sent via simulated email before accessing user dashboard or completing checkout.
                </p>

                {/* Change Admin Password */}
                <form onSubmit={handleAdminPasswordChange} className="pt-3 border-t border-[#F8D5E3] space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#241A20]">Change Admin Portal Password</h5>
                  
                  {adminPassMsg && (
                    <div className={`p-2.5 rounded-xl text-xs font-bold ${
                      adminPassMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {adminPassMsg.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold block mb-1">New Admin Password</label>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={adminNewPass}
                        onChange={(e) => setAdminNewPass(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Confirm Admin Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat password"
                        value={adminConfirmPass}
                        onChange={(e) => setAdminConfirmPass(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-tinkle text-xs font-bold py-2 px-5 rounded-xl cursor-pointer">
                    Update Admin Password
                  </button>
                </form>
              </div>

              {/* Manual Payment QR Code & Instructions Textarea */}
              <div className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#C4436A]" />
                  <div>
                    <h4 className="font-bold text-sm text-[#241A20]">Manual UPI Payment &amp; QR Code Setup</h4>
                    <span className="text-[11px] text-[#7A6370]">Configure QR code image/link and instructions shown to customers during manual checkout</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Payee Business Name *</label>
                    <input
                      type="text"
                      value={settings.manualUpi?.payeeName || ''}
                      onChange={(e) =>
                        updateSettings({
                          manualUpi: {
                            ...settings.manualUpi,
                            payeeName: e.target.value,
                            upiId: settings.manualUpi?.upiId || 'jewelaura@upi',
                            qrCodeUrl: settings.manualUpi?.qrCodeUrl || '',
                            instructions: settings.manualUpi?.instructions || '',
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      placeholder="JewelAura Merchant"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Store UPI ID *</label>
                    <input
                      type="text"
                      value={settings.manualUpi?.upiId || ''}
                      onChange={(e) =>
                        updateSettings({
                          manualUpi: {
                            ...settings.manualUpi,
                            payeeName: settings.manualUpi?.payeeName || 'JewelAura Merchant',
                            upiId: e.target.value,
                            qrCodeUrl: settings.manualUpi?.qrCodeUrl || '',
                            instructions: settings.manualUpi?.instructions || '',
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono"
                      placeholder="storename@upi"
                    />
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold block mb-1">
                    QR Code Image URL or Data Textarea *
                  </label>
                  <textarea
                    rows={3}
                    value={settings.manualUpi?.qrCodeUrl || ''}
                    onChange={(e) =>
                      updateSettings({
                        manualUpi: {
                          ...settings.manualUpi,
                          payeeName: settings.manualUpi?.payeeName || 'JewelAura Merchant',
                          upiId: settings.manualUpi?.upiId || 'jewelaura@upi',
                          qrCodeUrl: e.target.value,
                          instructions: settings.manualUpi?.instructions || '',
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono text-[11px]"
                    placeholder="Paste your hosted QR code image URL (e.g., https://.../qr.jpg or data:image/png;base64,...)"
                  />
                  <span className="text-[10px] text-[#7A6370]">
                    Tip: Admin can paste any QR code image URL here to display directly on customer checkout screen.
                  </span>
                </div>

                <div className="text-xs">
                  <label className="font-bold block mb-1">Manual Payment Customer Instructions</label>
                  <textarea
                    rows={2}
                    value={settings.manualUpi?.instructions || ''}
                    onChange={(e) =>
                      updateSettings({
                        manualUpi: {
                          ...settings.manualUpi,
                          payeeName: settings.manualUpi?.payeeName || 'JewelAura Merchant',
                          upiId: settings.manualUpi?.upiId || 'jewelaura@upi',
                          qrCodeUrl: settings.manualUpi?.qrCodeUrl || '',
                          instructions: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                    placeholder="Scan QR using PhonePe/GPay. Copy 12-digit UTR ref number into input box to confirm order."
                  />
                </div>
              </div>

              {/* Social Proof / Fake Ratings Booster Switch */}
              <div className="p-5 bg-gradient-to-r from-[#FFF0F5] to-[#FBE6EF] rounded-2xl border border-[#F7D8E4] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <div>
                      <h4 className="font-bold text-sm text-[#241A20]">Social Proof Rating Booster (Fake / Synthetic Ratings)</h4>
                      <span className="text-[11px] text-[#7A6370]">Automatically showcase 4.8★+ rating badges to skyrocket conversion</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.fakeRatingsEnabled}
                    onChange={(e) => updateSettings({ fakeRatingsEnabled: e.target.checked })}
                    className="w-5 h-5 accent-[#C4436A]"
                  />
                </div>

                {settings.fakeRatingsEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <label className="font-semibold block mb-1">Base Social Rating (e.g. 4.9)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="4.0"
                        max="5.0"
                        value={settings.fakeRatingBase ?? 4.9}
                        onChange={(e) => updateSettings({ fakeRatingBase: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Review Count Boost (+ counts)</label>
                      <input
                        type="number"
                        value={settings.fakeRatingCountBoost ?? 120}
                        onChange={(e) => updateSettings({ fakeRatingCountBoost: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Floating Chat Widget */}
              <div className="p-5 bg-[#FFF9FB] rounded-2xl border border-[#FBE6EF] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-sm text-[#241A20]">WhatsApp Instant Floating Chat Icon</h4>
                      <span className="text-[11px] text-[#7A6370]">Direct 1-tap customer chat floating at bottom corner</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.whatsappEnabled ?? true}
                    onChange={(e) => updateSettings({ whatsappEnabled: e.target.checked })}
                    className="w-5 h-5 accent-[#C4436A]"
                  />
                </div>

                {settings.whatsappEnabled && (
                  <div className="text-xs pt-2">
                    <label className="font-semibold block mb-1">WhatsApp Number with Country Code (e.g. +919876543210)</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber ?? ''}
                      onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF] bg-white font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Branding & Top Announcement Bar */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold block mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName ?? ''}
                    onChange={(e) => updateSettings({ storeName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    value={settings.announcementText ?? ''}
                    onChange={(e) => updateSettings({ announcementText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold ?? 999}
                      onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Inquiry Forwarding Email</label>
                    <input
                      type="email"
                      value={settings.forwardingEmail ?? ''}
                      onChange={(e) => updateSettings({ forwardingEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => confetti({ particleCount: 30, spread: 45, colors: ['#C4436A', '#38ef7d'] })}
                  className="btn-tinkle text-xs font-bold py-3 px-6 rounded-xl cursor-pointer"
                >
                  Settings Automatically Saved in Database
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EXPANDED ORDER DETAIL MODAL */}
      {selectedOrderForDetail && (
        <AdminOrderDetailModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
          onDeleteRequest={(ord) => {
            setConfirmDialogState({
              isOpen: true,
              title: 'Delete Order Record',
              message: `Are you sure you want to delete order ${ord.orderNumber} for ${ord.customerName}?`,
              confirmText: 'Delete Order',
              onConfirm: () => {
                deleteOrder(ord.id);
                setSelectedOrderForDetail(null);
                setConfirmDialogState((prev) => ({ ...prev, isOpen: false }));
              },
            });
          }}
        />
      )}

      {/* REUSABLE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={confirmDialogState.isOpen}
        title={confirmDialogState.title}
        message={confirmDialogState.message}
        confirmLabel={confirmDialogState.confirmText || 'Delete'}
        onCancel={() => setConfirmDialogState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialogState.onConfirm}
      />

    </div>
  );
};
