import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductDetailModal } from './ProductDetailModal';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useStore();

  if (!quickViewProduct) return null;

  return (
    <ProductDetailModal
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  );
};
