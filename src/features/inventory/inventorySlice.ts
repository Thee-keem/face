import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
  categoryId?: string;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface InventoryState {
  products: Product[];
  selectedProduct: Product | null;
  searchQuery: string;
  filters: {
    category?: string;
    lowStock: boolean;
    outOfStock: boolean;
    active: boolean;
    priceRange?: '0-50' | '50-100' | '100+';
  };
  isLoading: boolean;
}

const initialState: InventoryState = {
  products: [],
  selectedProduct: null,
  searchQuery: '',
  filters: {
    lowStock: false,
    outOfStock: false,
    active: true,
    priceRange: undefined,
  },
  isLoading: false,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<InventoryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateProductStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock = action.payload.stock;
      }
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setSearchQuery,
  setFilters,
  setLoading,
  updateProductStock,
} = inventorySlice.actions;

export default inventorySlice.reducer;