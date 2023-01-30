import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronLeft } from "react-icons/fa";
import Layout from "../../../components/layout/Layout";

export default function OrderPage({ order, items, customer }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const updateOrder = async (decision) => {
    const { error } = await supabaseClient
      .from("orders")
      .update({ status: decision })
      .eq("id", order.id);
    if (!error) router.replace(router.asPath);
  };

  const buttons = {
    pending: (
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`${order.id}/decline`}
          className="bg-maroon text-light font-bold rounded-full text-center"
        >
          DECLINE
        </Link>
        <button
          onClick={() => updateOrder("accepted")}
          className="bg-teal text-light font-bold rounded-full"
        >
          ACCEPT
        </button>
      </div>
    ),
    accepted: (
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`${order.id}/decline`}
          className="bg-maroon text-light font-bold rounded-full text-center"
        >
          CANCEL
        </Link>
        <button
          onClick={() => updateOrder("prepared")}
          className="bg-teal text-light font-bold rounded-full"
        >
          DONE PREPARING
        </button>
      </div>
    ),
    prepared: (
      <div className="grid gap-4">
        {order.delivery_option === "pickup" ? (
          <div className="font-semibold text-base text-center">
            Waiting for customer to pick up their order...
          </div>
        ) : (
          <button
            onClick={() => updateOrder("shipped")}
            className="bg-teal text-light font-bold rounded-full"
          >
            ORDER PICKED UP
          </button>
        )}
      </div>
    ),
    shipped: (
      <div className="grid font-semibold text-base text-center">
        Waiting for customer to receive their order...
      </div>
    ),
    cancelled: (
      <div className="grid font-semibold text-base text-center">
        This order has been cancelled.
      </div>
    ),
  };

  return (
    <>
      <Layout title="Order">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full p-1"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon" />
        </button>
        <p className="text-5xl font-bold text-dark text-center my-2">Order</p>
        <div className="flex flex-col m-4 text-lg">
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
          <div className="bg-cream min-h-[300px] p-4">
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
                <div className="text-maroon font-semibold text-end">
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
          </div>
          <div className="-translate-y-4 text-2xl font-bold text-center text-dark">
            Total Amount: <span>₱{order?.total.toFixed(2)}</span>
          </div>
          {buttons[order?.status]}
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

  const { data: customer } = await supabase
    .from("customers")
    .select("firstname, lastname, contact_no")
    .eq("id", data.customer_id)
    .single();

  return { props: { order: data, items, customer } };
};
