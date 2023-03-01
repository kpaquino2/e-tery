import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import Layout from "../../../components/layout/Layout";

export default function OrderPage({ order, items, customer }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [orderId, setOrderId] = useState(order.id);
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [rating, setRating] = useState(null);

  const updateOrder = async (decision) => {
    const { error } = await supabaseClient
      .from("orders")
      .update({ status: decision })
      .eq("id", order.id);
  };

  useEffect(() => {
    const subscription = supabaseClient
      .channel("db-changes-2")
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
          if (payload.new.order_rating) setRating(payload.new.order_rating);
        }
      )
      .subscribe();
    if (orderId !== order.id) {
      setOrderStatus("pending");
      setRating(null);
    }
    return () => {
      subscription.unsubscribe();
    };
  }, [orderId, order.id, supabaseClient]);

  const buttons = {
    pending: (
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`${order.id}/decline`}
          className="rounded-full bg-maroon text-center font-bold text-light"
        >
          DECLINE
        </Link>
        <button
          onClick={() => updateOrder("accepted")}
          className="rounded-full bg-teal font-bold text-light"
        >
          ACCEPT
        </button>
      </div>
    ),
    accepted: (
      <div className="grid gap-4">
        <button
          onClick={() => updateOrder("prepared")}
          className="rounded-full bg-teal font-bold text-light"
        >
          DONE PREPARING
        </button>
      </div>
    ),
    prepared: (
      <div className="grid gap-4">
        {order.delivery_option === "pickup" ? (
          <div className="text-center text-base font-semibold">
            Waiting for customer to pick up their order...
          </div>
        ) : (
          <button
            onClick={() => updateOrder("shipped")}
            className="rounded-full bg-teal font-bold text-light"
          >
            ORDER PICKED UP
          </button>
        )}
      </div>
    ),
    shipped: (
      <div className="grid text-center text-base font-semibold">
        Waiting for customer to receive their order...
      </div>
    ),
    completed: (
      <div className="grid place-items-center text-base font-semibold">
        This order has been completed
        <span>Rating:</span>
        <div className="flex items-center">
          {rating ? (
            <>
              {Array.from({ length: rating }, (v, i) => (
                <TiStarFullOutline key={i} className="h-5 w-5 text-maroon" />
              ))}
              {Array.from({ length: 5 - rating }, (v, i) => (
                <TiStarFullOutline key={i} className="h-5 w-5 text-zinc-400" />
              ))}
            </>
          ) : (
            <>no ratings yet</>
          )}
        </div>
      </div>
    ),
    declined: (
      <div className="grid text-center text-base font-semibold">
        This order has been declined.
      </div>
    ),
  };

  return (
    <>
      <Layout title="Order">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full p-1"
          onClick={() => router.push("/orders")}
        >
          <FaChevronLeft className="text-3xl text-maroon" />
        </button>
        <p className="my-2 text-center text-5xl font-bold text-dark">
          Order #{order.number.toString().padStart(3, "0")}
        </p>
        <div className="m-4 flex flex-col text-lg">
          <span>
            Name of Customer:{" "}
            <span className="font-bold">
              {customer?.firstname + " " + customer?.lastname}
            </span>
          </span>
          <span>
            Contact number:{" "}
            <span className="font-semibold">{customer?.contact_no}</span>
          </span>
          <span>
            Delivery option:
            <span className="font-semibold">
              {order?.delivery_option === "delivery"
                ? " Room Delivery"
                : " Pickup"}
            </span>
          </span>
          <span>
            Mode of payment:
            <span className="font-semibold">
              {order?.payment_option === "cod"
                ? " Cash on Delivery"
                : " Over the counter"}
            </span>
          </span>
          <span>
            Time:{" "}
            <span className="font-semibold">
              {moment(order?.time, "HH:mm:ss").format("hh:mm:ss A")}
            </span>
          </span>
          {order.note && (
            <span>
              Note: <span className="font-semibold">{order?.note}</span>
            </span>
          )}
          <div className="min-h-[300px] bg-cream p-4">
            {order?.order_items.map((item, index) => (
              <div key={index} className="m-2 grid grid-cols-[1fr_3fr_1.5fr]">
                <div className="text-center font-bold text-maroon">
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
                <div className="text-end font-semibold text-maroon">
                  ₱{item.price.toFixed(2)}
                </div>
              </div>
            ))}
            <div className="m-2 grid grid-cols-2 border-t-2 border-teal">
              <span className="font-bold">Subtotal</span>
              <span className="text-end font-semibold text-maroon">
                ₱{(order?.total - 10).toFixed(2)}
              </span>
              <span className="font-bold">Service Fee</span>
              <span className="text-end font-semibold text-maroon">₱10.00</span>
            </div>
          </div>
          <div className="-translate-y-4 text-center text-2xl font-bold text-dark">
            Total Amount: <span>₱{order?.total.toFixed(2)}</span>
          </div>
          {buttons[orderStatus]}
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
      "id, total, status, payment_option, order_rating, delivery_option, time, status, room_id, note, customer_id, number, order_items (id, item_id, quantity, price, order_item_options (option_id))"
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

  const { data: customer } = await supabase
    .from("customers")
    .select("firstname, lastname, contact_no")
    .eq("id", data.customer_id)
    .single();

  return { props: { order: data, items, customer } };
};
