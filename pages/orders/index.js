import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import moment from "moment/moment";
import Link from "next/link";
import { useState } from "react";
import { FaClock, FaRegClock } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

export default function OrdersPage({ orders, acct_type }) {
  const [tab, setTab] = useState(0);
  const statusColor = {
    pending: "bg-gray-400 text-gray-900",
    accepted: "bg-blue-400 text-blue-900",
    declined: "bg-red-400 text-red-900",
  };

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
        <div className="flex flex-col m-2 gap-2">
          {orders?.map(
            (order, index) =>
              (tab === 1 ||
                [
                  "in-transit",
                  "ready",
                  "prepared",
                  "accepted",
                  "pending",
                ].includes(order.status)) && (
                <Link
                  href={
                    acct_type === "vendor"
                      ? `/orders/v/${order.id}`
                      : `/orders/c/${order.id}`
                  }
                  key={index}
                  className="p-2 bg-cream rounded-lg text-teal grid grid-cols-[2fr_1fr]"
                >
                  <span>
                    {order.payment_option === "cod"
                      ? "Cash on Delivery"
                      : "Over the counter"}
                  </span>
                  <span
                    className={
                      statusColor[order.status] +
                      " flex row-span-2 m-1 justify-center items-center font-semibold rounded-lg"
                    }
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <span>
                    {order.delivery_option === "delivery"
                      ? "Room Delivery"
                      : "Pickup"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegClock className="text-maroon" />
                    {moment(order.time, "HH:mm:ss").format("hh:mm A")}
                  </span>
                  <span className="text-lg font-semibold text-center">
                    ₱ {order.total.toFixed(2)}
                  </span>
                </Link>
              )
          )}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const acct_type = session?.user.email?.endsWith("@g.batstate-u.edu.ph")
    ? "customer"
    : "vendor";

  const { data } = await supabase
    .from("orders")
    .select(
      "id, total, payment_option, delivery_option, time, status, room_id, order_rating"
    )
    .order("time", { ascending: false });

  return { props: { orders: data, acct_type } };
};
