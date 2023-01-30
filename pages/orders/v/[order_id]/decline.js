import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import { TbClock, TbDoor, TbPaperBagOff } from "react-icons/tb";
import CheckboxInputAlt from "../../../../components/forms/CheckboxInputAlt";
import Drawer from "../../../../components/layout/Drawer";
import Layout from "../../../../components/layout/Layout";

export default function DeclinePage({ items }) {
  const supabaseClient = useSupabaseClient();
  const { register, handleSubmit } = useForm();
  const [isUnavailableOpen, setIsUnavailableOpen] = useState(false);
  const router = useRouter();

  const setItemsAsUnavailable = async (data) => {
    const { error: unavailableError } = await supabaseClient
      .from("items")
      .update({ available: false })
      .in(
        "id",
        Object.keys(data).filter((d) => data[d])
      );

    if (unavailableError) console.error(error.message);

    const { error: statusError } = await supabaseClient
      .from("orders")
      .update({ status: "declined", decline_reason: "Unavailable item/s" })
      .eq("id", router.query.order_id);

    if (!statusError) router.back();
  };

  const declineOrder = async (reason) => {
    const { error: statusError } = await supabaseClient
      .from("orders")
      .update({ status: "declined", decline_reason: reason })
      .eq("id", router.query.order_id);

    if (!statusError) router.back();
  };

  return (
    <>
      <Drawer
        isOpen={isUnavailableOpen}
        setIsOpen={setIsUnavailableOpen}
        top="top-0"
      >
        <div className="pt-16 text-4xl text-center font-black text-light">{`Which item${
          items.length > 1 ? "s are" : " is"
        } not available?`}</div>
        <div className="text-light text-xl">
          These items will be set as unavailable.
        </div>
        <form
          onSubmit={handleSubmit(setItemsAsUnavailable)}
          className="flex flex-col gap-4 mt-4 w-2/3"
        >
          {items?.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckboxInputAlt
                id={item.id}
                value={true}
                size={7}
                register={register}
                name={item.id}
              />
              <label htmlFor={item.id} className="text-xl text-light">
                {item.name}
              </label>
            </div>
          ))}
          <button className="rounded-full bg-teal text-light text-xl font-bold py-2">
            CONTINUE
          </button>
        </form>
      </Drawer>
      <Layout title="Decline Order">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full p-1"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon" />
        </button>
        <div className="mx-8 mt-16">
          <p className="text-4xl font-black text-burgundy">
            Why are you going to decline?
          </p>
          <p className="text-burgundy text-lg">Select a reason for declining</p>
          <div className="flex flex-col gap-4 mx-2 my-8">
            <button
              type="button"
              className="bg-cream grid grid-cols-[1fr_4fr] rounded-2xl items-center p-5 text-maroon"
              onClick={() => setIsUnavailableOpen(true)}
            >
              <TbPaperBagOff className="text-5xl place-self-center" />
              <p className="text-2xl font-bold">Item is unavailable</p>
            </button>
            <button
              type="button"
              className="bg-cream grid grid-cols-[1fr_4fr] rounded-2xl items-center p-5 text-maroon"
              onClick={() => declineOrder("Store is too busy")}
            >
              <TbClock className="text-5xl place-self-center" />
              <p className="text-2xl font-bold">too busy</p>
            </button>
            <button
              type="button"
              className="bg-cream grid grid-cols-[1fr_4fr] rounded-2xl items-center p-5 text-maroon"
              onClick={() => declineOrder("Store is closed")}
            >
              <TbDoor className="text-5xl place-self-center" />
              <p className="text-2xl font-bold">store closed</p>
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data: orderItems } = await supabase
    .from("orders")
    .select("order_items (item_id)")
    .eq("id", ctx.params.order_id)
    .single();

  if (!orderItems) return { notFound: true };
  const { data: items } = await supabase
    .from("items")
    .select("id, name")
    .in(
      "id",
      orderItems.order_items.map((i) => i.item_id)
    );
  return { props: { items } };
};
