import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { useKeenSlider } from "keen-slider/react";
import * as moment from "moment";

export default function VendorOrders({ orders }) {
  const [tab, setTab] = useState(0);
  const inclusions = [
    ["accepted", "prepared", "shipped"],
    ["accepted", "prepared", "shipped", "declined", "completed"],
  ];

  const [sliderRef] = useKeenSlider({
    mode: "free-snap",
    slides: {
      origin: "center",
      perView: 2,
      spacing: 12,
    },
  });

  return (
    <>
      <p className="text-5xl font-bold text-dark text-center my-2 mx-12">
        Pending Orders
      </p>
      <div ref={sliderRef} className="keen-slider mt-4">
        {orders
          ?.filter((order) => order.status === "pending")
          .map((order, index) => (
            <Link
              href={`/orders/v/${order.id}`}
              key={index}
              className="keen-slider__slide h-48 bg-cream p-3 rounded-2xl text-burgundy"
            >
              <div className="text-3xl font-black">
                #{order.number.toString().padStart(3, "0")}
              </div>
              <div className="text-lg">
                {order.order_items.length} item
                {order.order_items.length > 1 && "s"}
              </div>
              <div className="text-zinc-600">
                {moment(order.created_at).fromNow()}
              </div>
            </Link>
          ))}
        {!orders?.filter((order) => order.status === "pending").length && (
          <div className="keen-slider__slide h-48 bg-teal p-3 rounded-2xl text-cream font-bold text-2xl">
            No upcoming orders yet
          </div>
        )}
      </div>
      <p className="text-5xl font-bold text-dark text-center my-2">Orders</p>
      <div className="grid grid-cols-2 place-items-center">
        <div
          onClick={() => setTab(0)}
          className="relative rounded-full px-3 py-0.5 text-dark font-semibold text-xl"
        >
          Active
          {tab === 0 && (
            <motion.div
              className="absolute bg-teal inset-x-0 bottom-0 h-1 rounded-full "
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
              className="absolute bg-teal inset-x-0 bottom-0 h-1 rounded-full "
              layoutId="tab"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col m-2 gap-2">
        {orders
          ?.filter((order) => inclusions[tab].includes(order.status))
          .map((order, index) => (
            <Link
              href={`/orders/v/${order.id}`}
              key={index}
              className="p-2 bg-cream rounded-lg text-teal font-semibold grid grid-cols-3 grid-rows-2 grid-flow-col place-items-center"
            >
              <div className="text-3xl font-black">
                #{order.number.toString().padStart(3, "0")}
              </div>
              <div className="text-lg">
                {order.order_items.length} item
                {order.order_items.length > 1 && "s"}
              </div>
              <div className="">
                {order.delivery_option === "delivery"
                  ? "Room Delivery"
                  : "Pickup"}
              </div>
              <div className="flex items-center gap-1">
                <FaRegClock className="text-maroon" />
                {moment(order.time, "HH:mm:ss").format("hh:mm A")}
              </div>
              <div className="text-lg font-semibold">
                ₱{order.total.toFixed(2)}
              </div>
              <div className="text-xl font-bold">{order.status}</div>
            </Link>
          ))}
      </div>
    </>
  );
}
