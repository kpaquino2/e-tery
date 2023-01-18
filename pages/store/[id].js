import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import StoreItem from "../../components/customer/StoreItem";
import Layout from "../../components/layout/Layout";
import Banner from "../../components/vendor/Banner";

export default function StorePage({ store }) {
  return (
    <>
      <Layout title={store.name}>
        <div className="flex flex-col items-center">
          <Banner id={store.id} />
          <div className="font-bold text-4xl">{store.name}</div>
          <div className="flex flex-col px-2 pb-12 w-full">
            {store.categories.length ? (
              store.categories.map((category, index) => (
                <div key={index}>
                  <div className="text-2xl font-semibold text-center">
                    {category.name}
                  </div>
                  <div className="columns-2 gap-2">
                    {category.items.map((item, index) => (
                      <StoreItem key={index} vendor_id={store.id} data={item} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data } = await supabase
    .from("vendors")
    .select(
      "id, name, open, categories (id, name, desc, items (id, name, description, base_price, available))"
    )
    .eq("id", ctx.params.id);
  console.log(data);
  if (!data?.length) return { notFound: true };
  return { props: { store: data[0] } };
};
