import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCart = create(
  persist(
    (set, get) => ({
      cart_owner: "",
      cart: [],
      totalQty: 0,
      clearCart: (customer_id) =>
        set({ cart_owner: customer_id, cart: [], totalQty: 0 }),
      getCartStore: (store_id) =>
        get().cart.find((store) => store.id === store_id),
      addToCart: (store) => {
        const index = get().cart.findIndex((s) => s.id === store.id);
        if (index === -1)
          set((state) => ({
            cart: [
              ...state.cart,
              {
                id: store.id,
                name: store.name,
                open: store.open,
                address: store.address,
                subtotal: store.order_item.price,
                items: [store.order_item],
              },
            ],
            totalQty: state.totalQty + store.order_item.quantity,
          }));
        else
          set((state) => {
            state.cart[index].items.push(store.order_item);
            state.cart[index].subtotal += store.order_item.price;
            return { totalQty: state.totalQty + store.order_item.quantity };
          });
      },
      removeItemFromCart: (store_id, item) => {
        const index = get().cart.findIndex((store) => store.id === store_id);
        const item_index = get().cart[index].items.findIndex(
          (v) => JSON.stringify(v) === JSON.stringify(item)
        );
        set((state) => {
          const item_qty = state.cart[index].items[item_index].quantity;
          return {
            totalQty: state.totalQty - item_qty,
            cart: [
              ...state.cart.slice(0, index),
              {
                ...state.cart[index],
                items: state.cart[index].items.filter(
                  (_, idx) => idx !== item_index
                ),
                subtotal: state.cart[index].subtotal - item.price,
              },
              ...state.cart.slice(index + 1),
            ],
          };
        });
      },
      removeStoreFromCart: (store_id) => {
        const index = get().cart.findIndex((store) => store.id === store_id);
        if (index !== -1)
          set((state) => {
            const new_qty =
              state.totalQty -
              state.cart[index].items
                .map((item) => item.quantity)
                .reduce((a, b) => a + b);
            state.cart.splice(index, 1);
            return {
              totalQty: new_qty,
            };
          });
      },
    }),
    { name: "cart" }
  )
);

export default useCart;
