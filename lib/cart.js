import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCart = create(
  persist((set) => ({
    stores: [],
    addToCart: (params) => {
      set((state) => ({ stores: [...state.stores, params] }));
    },
  }))
);

export default useCart;
