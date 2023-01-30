import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaStar } from "react-icons/fa";
import Layout from "../../../components/layout/Layout";

const bar = {
  done: {
    clipPath: `inset(0 0 0 100%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      delay: 1,
    },
  },
  tocome: {
    clipPath: `inset(0 0 0 0%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      delay: 1,
    },
  },
  ongoing: {
    clipPath: `inset(0 0 0 100%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      delay: 1,
    },
  },
};

export default function OrderStatusPage({ order, items }) {
  const supabaseClient = useSupabaseClient();
  const states =
    order.delivery_option === "delivery"
      ? ["pending", "accepted", "prepared", "shipped", "completed"]
      : ["pending", "accepted", "prepared", "completed"];
  const [orderStatus, setOrderStatus] = useState(order.status);
  const statusMessage = {
    pending: [
      "Your order has been submitted",
      "Waiting for the vendor to accept your order",
    ],
    accepted: ["Your order has been accepted", "It is not being prepared"],
    prepared: [
      "Your order has been prepared",
      order.delivery_option === "delivery"
        ? "It is now ready for delivery"
        : "It is now ready to be picked up.",
    ],
    shipped: ["Your order has been picked up", "It is now out for delivery"],
  };
  const router = useRouter();

  const [rated, setRated] = useState(order.order_rating);
  const [rating, setRating] = useState(0);

  const receiveOrder = async () => {
    await supabaseClient
      .from("orders")
      .update({ status: "completed" })
      .eq("id", order.id);
  };

  const submitRating = async () => {
    await supabaseClient
      .from("orders")
      .update({ order_rating: rating })
      .eq("id", order.id);
  };

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
          if (payload.new.order_rating) setRated(true);
        }
      )
      .subscribe();
  }, [order.id, supabaseClient]);
  return (
    <>
      <Layout title="Order Status">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full p-1"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon" />
        </button>
        <p className="text-5xl font-bold text-dark text-center my-2">
          Order Status
        </p>
        <div className="m-4 p-4 bg-cream rounded-lg">
          <div className="grid grid-flow-col">
            {states.map((state, index) => (
              <div key={index} className="grid place-items-center">
                <motion.div
                  animate={
                    states.indexOf(orderStatus) >= index
                      ? { backgroundColor: "#26B0BA" }
                      : { backgroundColor: "#d4d4d8" }
                  }
                  transition={{
                    duration: 1,
                  }}
                  className="shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] z-10 w-6 h-6 rounded-full col-start-1 row-start-1 grid place-self-center"
                />
                {index < states.length - 1 && (
                  <motion.div
                    animate={
                      states.indexOf(orderStatus) < index
                        ? {
                            background: "#d4d4d8",
                          }
                        : states.indexOf(orderStatus) > index
                        ? {
                            background: "#26B0BA",
                          }
                        : states.indexOf(orderStatus) === index && {
                            background: [
                              "linear-gradient(to right, #26B0BA -200%, #BBEEF1 -100%, #26B0BA 0%, #BBEEF1 100%)",
                              "linear-gradient(to right, #26B0BA -100%, #BBEEF1 0%, #26B0BA 100%, #BBEEF1 200%)",
                              "linear-gradient(to right, #26B0BA 0%, #BBEEF1 100%, #26B0BA 200%, #BBEEF1 300%)",
                            ],
                            transition: {
                              repeat: Infinity,
                              duration: 2,
                            },
                          }
                    }
                    className="shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] col-start-1 row-start-1 h-2 w-full translate-y-0 translate-x-0 ml-[100%]"
                  >
                    <motion.div
                      animate={
                        states.indexOf(orderStatus) < index
                          ? "tocome"
                          : states.indexOf(orderStatus) > index
                          ? "done"
                          : "ongoing"
                      }
                      variants={bar}
                      className="shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)] bg-zinc-300 h-full"
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          {orderStatus !== "completed" && orderStatus !== "declined" ? (
            <div>
              <Image
                src={`graphics/${orderStatus}.png`}
                alt="NO STORES"
                width={600}
                height={600}
              />
              <div className="text-xl font-bold text-center text-dark">
                {statusMessage[orderStatus][0]}
              </div>
              <div className="font-semibold text-center text-dark">
                {statusMessage[orderStatus][1]}
              </div>
              {((order.delivery_option === "delivery" &&
                orderStatus === "shipped") ||
                (order.delivery_option === "pickup" &&
                  orderStatus === "prepared")) && (
                <button
                  onClick={receiveOrder}
                  className="bg-maroon w-full rounded-full text-cream font-bold text-lg mt-2"
                >
                  ORDER RECEIVED
                </button>
              )}
            </div>
          ) : orderStatus === "completed" ? (
            <div>
              <div className="text-xl font-bold text-center text-dark">
                Order has been received
              </div>
              <div className="font-semibold text-center text-dark">
                Enjoy your food!
              </div>

              {rated ? (
                <div className="text-lg font-semibold text-center text-dark mt-2">
                  Thank you for rating!
                </div>
              ) : (
                <>
                  <div className="text-lg font-semibold text-center text-dark mt-2">
                    How was the food?
                  </div>
                  <div className="text-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        className="text-4xl"
                        onClick={() => {
                          setRating(value);
                        }}
                      >
                        <FaStar
                          className={
                            (value > rating
                              ? "text-zinc-400"
                              : "text-amber-400") +
                            " transition duration-300 active:-translate-y-2"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={submitRating}
                    className="bg-maroon w-full rounded-full text-cream font-bold text-lg mt-2 disabled:grayscale"
                    disabled={!rating}
                  >
                    SUBMIT RATING
                  </button>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xl font-bold text-center text-dark">
                Your order has been declined.
              </div>
              <div className="font-semibold text-center text-dark">
                {order.decline_reason}
              </div>
            </div>
          )}
        </div>
        <div className="bg-cream mx-4 mb-4 p-4 rounded-lg">
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
            <span className="font-bold">Service Fee</span>
            <span className="text-end font-semibold text-maroon">₱10.00</span>
          </div>
          <div className="text-2xl font-bold text-center text-dark">
            Total Amount: <span>₱{order?.total.toFixed(2)}</span>
          </div>
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
      "id, total, status, payment_option, delivery_option, time, status, room_id, note, customer_id, vendor_id, order_rating, decline_reason, order_items (id, item_id, quantity, price, order_item_options (option_id))"
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
