import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCart = create(
  persist(
    (set, get) => ({
      cart: [],
      totalQty: 0,
      getCartStore: (param) => get().cart.find((store) => store.id === param),
      addToCart: (param) => {
        const index = get().cart.findIndex((store) => store.id === param.id);
        if (index === -1)
          set((state) => ({
            cart: [
              ...state.cart,
              {
                id: param.id,
                name: param.name,
                open: param.open,
                items: [param.order_item],
              },
            ],
            totalQty: state.totalQty + 1,
          }));
        else
          set((state) => {
            state.cart[index].items.push(param.order_item);
            return { totalQty: state.totalQty + 1 };
          });
      },
    }),
    { name: "cart" }
  )
);

export default useCart;
