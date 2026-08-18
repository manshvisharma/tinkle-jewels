import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopBarNavigation } from './components/TopBarNavigation';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShortcuts } from './components/CategoryShortcuts';
import { TrendingSection } from './components/TrendingSection';
import { PromoBanners } from './components/PromoBanners';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { PerksSection } from './components/PerksSection';
import { InstagramGrid } from './components/InstagramGrid';
import { ReviewsSection } from './components/ReviewsSection';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Footer } from './components/Footer';

// Interactive Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { ShopPage } from './components/ShopPage';
import { AdminDashboard } from './components/AdminDashboard';
import { InstallerWizard } from './components/InstallerWizard';
import { PhpInspectorModal } from './components/PhpInspectorModal';

const StoreContent: React.FC = () => {
  const { activeView, selectedProduct, setSelectedProduct } = useStore();
  const [isPhpModalOpen, setIsPhpModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2C2329] selection:bg-[#FCD2E2] selection:text-[#C4436A]">
      {/* Top Bar for Mode Switching & Direct cPanel ZIP Download */}
      <TopBarNavigation onOpenPhpInspector={() => setIsPhpModalOpen(true)} />

      {/* Main View Router */}
      {activeView === 'admin' ? (
        <AdminDashboard />
      ) : activeView === 'installer' ? (
        <InstallerWizard />
      ) : (
        <>
          {/* Main Storefront Header */}
          <Header />

          {/* Main Body */}
          <main className="flex-grow">
            {activeView === 'home' || activeView === 'storefront' ? (
              <>
                <Hero />
                <CategoryShortcuts />
                <TrendingSection />
                <PromoBanners />
                <NewArrivalsSection />
                <PerksSection />
                <InstagramGrid />
                <ReviewsSection />
                <NewsletterBanner />
              </>
            ) : (
              <ShopPage />
            )}
          </main>

          {/* Boutique Footer */}
          <Footer />
        </>
      )}

      {/* Overlay Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <QuickViewModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <CustomerAccountModal />
      <WishlistDrawer />
      <SearchModal />
      <PhpInspectorModal
        isOpen={isPhpModalOpen}
        onClose={() => setIsPhpModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
