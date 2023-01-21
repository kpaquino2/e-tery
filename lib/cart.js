import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCart = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (param) => {
        const index = get().cart.findIndex(
          (store) => store.id === param.store_id
        );
        if (index === -1)
          set((state) => ({
            cart: [
              ...state.cart,
              { id: param.store_id, items: [param.order_item] },
            ],
          }));
        else
          set((state) => {
            state.cart[index].items.push(param.order_item);
            return state;
          });
      },
    }),
    { name: "cart" }
  )
);

export default useCart;
