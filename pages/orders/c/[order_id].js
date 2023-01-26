import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";

export default function OrderStatusPage({ order, items }) {
  const supabaseClient = useSupabaseClient();
  const states =
    order.delivery_option === "delivery"
      ? ["pending", "accepted", "prepared", "picked_up", "received"]
      : ["pending", "accepted", "prepared", "received"];
  const [orderStatus, setOrderStatus] = useState(order.status);

  useEffect(() => {
    const subscription = supabaseClient
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrderStatus(payload.new.status);
        }
      )
      .subscribe();
  }, [order.id, supabaseClient]);
  return (
    <>
      <Layout title="Order Status">
        <div className="bg-cream m-4 p-4 rounded-lg">
          {order?.order_items.map((item, index) => (
            <div key={index} className="m-2 grid grid-cols-[1fr_3fr_1.5fr]">
              <div className="text-maroon font-bold text-center">
                {item.quantity}x
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{items[index].item_name}</span>
                {items[index].options.map((option, index) => (
                  <div key={index} className="text-sm">
                    {option.name}
                  </div>
                ))}
              </div>
              <div className="text-end text-maroon font-semibold">
                ₱{item.price.toFixed(2)}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 m-2 border-t-2 border-teal">
            <span className="font-bold">Subtotal</span>
            <span className="text-end font-semibold text-maroon">
              ₱{(order?.total - 10).toFixed(2)}
            </span>
            <span className="font-bold">Delivery Fee</span>
            <span className="text-end font-semibold text-maroon">₱10.00</span>
          </div>
          <div className="text-2xl font-bold text-center text-dark">
            Total Amount: <span>₱{order?.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mx-4 p-4 bg-cream rounded-lg">
          <div className="grid grid-flow-col">
            {states.map((state, index) => (
              <div key={index} className="grid place-items-center">
                <motion.div
                  animate={
                    states.indexOf(orderStatus) >= index
                      ? { backgroundColor: "#26B0BA" }
                      : { backgroundColor: "#d4d4d8" }
                  }
                  className={
                    (states.indexOf(orderStatus) >= index
                      ? "bg-teal"
                      : "bg-stone-300") +
                    "  shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] z-10 w-6 h-6 rounded-full col-start-1 row-start-1 grid place-self-center"
                  }
                />
                {index < states.length - 1 && (
                  <motion.div
                    animate={
                      states.indexOf(orderStatus) < index
                        ? { backgroundColor: "#d4d4d8" }
                        : states.indexOf(orderStatus) > index
                        ? { backgroundColor: "#26B0BA" }
                        : states.indexOf(orderStatus) === index && {
                            background: [
                              "linear-gradient(to right, #26B0BA -200%, #197278 -100%, #26B0BA 0%, #197278 100%)",
                              "linear-gradient(to right, #26B0BA -100%, #197278 0%, #26B0BA 100%, #197278 200%)",
                              "linear-gradient(to right, #26B0BA 0%, #197278 100%, #26B0BA 200%, #197278 300%)",
                            ],
                            transition: {
                              repeat: Infinity,
                              duration: 2,
                              delay: 1,
                            },
                          }
                    }
                    className={
                      (states.indexOf(orderStatus) >= index
                        ? "bg-teal"
                        : "bg-stone-300") +
                      "  shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] col-start-1 row-start-1 h-2 w-full translate-y-0 translate-x-0 ml-[100%]"
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div>{orderStatus}</div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data } = await supabase
    .from("orders")
    .select(
      "id, total, status, payment_option, delivery_option, time, status, room_id, note, customer_id, order_items (id, item_id, quantity, price, order_item_options (option_id))"
    )
    .eq("id", ctx.params.order_id)
    .single();

  if (!data) return { notFound: true };
  const items = await Promise.all(
    data.order_items.map(async (item) => {
      const { data: item_details } = await supabase
        .from("items")
        .select("name")
        .eq("id", item.item_id)
        .single();

      const { data: options } = await supabase
        .from("item_options")
        .select("name")
        .in(
          "id",
          item.order_item_options?.map((option) => option.option_id)
        );
      return { item_name: item_details.name, options };
    })
  );

  return { props: { order: data, items } };
};
