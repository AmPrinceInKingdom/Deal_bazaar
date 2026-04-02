import { create } from "zustand";

export type CompareItem = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  image: string;
  description: string;
  inStock?: boolean;
};

type CompareStore = {
  items: CompareItem[];
  isDrawerOpen: boolean;
  maxItems: number;

  addToCompare: (product: CompareItem) => {
    success: boolean;
    message: string;
  };

  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;

  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  maxItems: 4,

  addToCompare: (product) => {
    const { items, maxItems } = get();

    const alreadyExists = items.some((item) => item.id === product.id);

    if (alreadyExists) {
      return {
        success: false,
        message: "This product is already in compare.",
      };
    }

    if (items.length >= maxItems) {
      return {
        success: false,
        message: `You can compare up to ${maxItems} products.`,
      };
    }

    set({
      items: [...items, product],
    });

    return {
      success: true,
      message: "Product added to compare.",
    };
  },

  removeFromCompare: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  clearCompare: () => {
    set({
      items: [],
      isDrawerOpen: false,
    });
  },

  isInCompare: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  openDrawer: () => {
    set({ isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false });
  },

  toggleDrawer: () => {
    set((state) => ({
      isDrawerOpen: !state.isDrawerOpen,
    }));
  },
}));