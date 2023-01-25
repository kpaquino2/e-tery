import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import moment from "moment/moment";
import { useState } from "react";
import { FaClock } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

export default function OrdersPage({ orders }) {
  const [tab, setTab] = useState(0);
  const statusColor = { pending: "bg-gray-400 text-gray-900" };

  return (
    <>
      <Layout title="Orders">
        <p className="text-5xl font-bold text-dark text-center my-2">Orders</p>
        <div className="grid grid-cols-2 place-items-center">
          <div
            onClick={() => setTab(0)}
            className="relative rounded-full px-3 py-0.5 text-dark font-semibold text-xl"
          >
            Active
            {tab === 0 && (
              <motion.div
                className="absolute bg-cream inset-0 -z-50 rounded-full"
                layoutId="tab"
              />
            )}
          </div>
          <div
            onClick={() => setTab(1)}
            className="relative rounded-full px-3 py-0.5 text-dark font-semibold text-xl"
          >
            All Orders
            {tab === 1 && (
              <motion.div
                className="absolute bg-cream inset-0 -z-50 rounded-full"
                layoutId="tab"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col m-2">
          {tab === 0
            ? orders?.map(
                (order, index) =>
                  order.status !== "delivered" && (
                    <div
                      key={index}
                      className="p-2 bg-teal rounded-lg text-cream grid grid-cols-[2fr_1fr]"
                    >
                      <span className="flex items-center gap-1 font-semibold text-lg">
                        <FaClock className="text-maroon" />
                        {moment(order.time, "HH:mm:ss").format("hh:mm A")}
                      </span>
                      <span className="text-lg row-span-3 col-start-2 font-semibold place-self-center">
                        Php {order.total.toFixed(2)}
                      </span>
                      <span>
                        {order.payment_option === "cod"
                          ? "Cash on Delivery"
                          : "Over the counter"}
                      </span>

                      <span>
                        {order.delivery_option === "delivery"
                          ? "Room Delivery"
                          : "Pickup"}
                      </span>
                      <span
                        className={
                          "w-min px-3 rounded-full col-span-full place-self-center " +
                          statusColor[order.status]
                        }
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  )
              )
            : orders?.map((order, index) => (
                <div key={index}>{order.total}</div>
              ))}
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
      "id, total, payment_option, delivery_option, time, status, room_id, order_rating"
    );

  return { props: { orders: data } };
};
