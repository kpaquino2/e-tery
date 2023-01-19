import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Footer from "../../../../components/layout/Footer";
import Layout from "../../../../components/layout/Layout";
import Banner from "../../../../components/vendor/Banner";
import { TiMinus, TiPlus } from "react-icons/ti";

export default function StoreItemPage({ store_id, item }) {
  const [quantity, setQuantity] = useState(1);

  const subtract = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const add = () => {
    setQuantity(quantity + 1);
  };
  return (
    <>
      <Layout title={item.name}>
        <Banner url={`items/${store_id}/${item.id}`} />
        <div className="grid grid-cols-2 mx-6">
          <div className="font-bold text-4xl">{item.name}</div>
          <div className="font-semibold text-xl row-span-2 justify-self-end self-center">
            Php {item.base_price.toFixed(2)}
          </div>
          <div className="text-2xl">{item.description}</div>
          <div className="bg-cream h-1 my-2 col-span-2 rounded-full" />
        </div>
      </Layout>
      <Footer>
        <div className="grid grid-cols-3 gap-3 h-full mx-4">
          <div className="flex items-center justify-around">
            <button onClick={subtract} className="bg-light rounded-full p-1">
              <TiMinus className="text-maroon text-2xl font-semibold" />
            </button>
            <span className="text-cream font-bold text-2xl">{quantity}</span>
            <button onClick={add} className="bg-light rounded-full p-1">
              <TiPlus className="text-maroon text-2xl font-semibold" />
            </button>
          </div>
          <button className="bg-light my-2 rounded-full text-xl font-bold text-maroon">
            BUY NOW
          </button>
          <button className="bg-light my-2 rounded-full text-xl font-bold text-dark">
            ADD TO CART
          </button>
        </div>
      </Footer>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase
    .from("items")
    .select("*")
    .eq("id", ctx.params.item_id)
    .single();

  if (!data) return { notFound: true };
  return { props: { store_id: ctx.params.id, item: data } };
};
