import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import * as moment from "moment";
import { TiStarFullOutline } from "react-icons/ti";

export default function CustomerOrders({ orders }) {
  const [tab, setTab] = useState(0);
  const inclusions = [["accepted", "prepared", "shipped"], ["completed"]];
  return (
    <>
      {" "}
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
          History
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
              href={`/orders/c/${order.id}`}
              key={index}
              className="p-2 bg-teal rounded-lg text-cream font-semibold flex flex-col"
            >
              <div className="flex justify-between">
                <div className="text-2xl font-bold">{order.vendor.name}</div>
                <div className="row-span-2 text-lg font-semibold">
                  ₱{order.total.toFixed(2)}
                </div>
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
              <div className="flex justify-between">
                <div className="">
                  {moment(order.created_at).format("MMMM D, Y h:mm a")}
                </div>
                <div className="flex items-center">
                  {order.status === "completed" ? (
                    order.order_rating ? (
                      <>
                        {Array.from({ length: order.order_rating }, (v, i) => (
                          <TiStarFullOutline
                            key={i}
                            className="w-5 h-5 text-maroon"
                          />
                        ))}
                        {Array.from(
                          { length: 5 - order.order_rating },
                          (v, i) => (
                            <TiStarFullOutline
                              key={i}
                              className="w-5 h-5 text-zinc-400"
                            />
                          )
                        )}
                      </>
                    ) : (
                      <>no ratings yet</>
                    )
                  ) : (
                    <>{order.status}</>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
