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
                address: param.address,
                subtotal: param.order_item.price,
                items: [param.order_item],
              },
            ],
            totalQty: state.totalQty + param.order_item.quantity,
          }));
        else
          set((state) => {
            state.cart[index].items.push(param.order_item);
            state.cart[index].subtotal += param.order_item.price;
            return { totalQty: state.totalQty + param.order_item.quantity };
          });
      },
      removeStoreFromCart: (param) => {
        const index = get().cart.findIndex((store) => store.id === param);
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
