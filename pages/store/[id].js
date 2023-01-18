import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import Banner from "../../components/vendor/Banner";

export default function StorePage({ store }) {
  return (
    <>
      <Layout title={store.name}>
        <div className="flex flex-col items-center">
          <Banner id={store.id} />
          <div className="font-bold text-4xl">{store.name}</div>
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
      "id, name, categories (id, name, items (id, name, base_price, available))"
    )
    .eq("id", ctx.params.id);
  console.log(data);
  if (!data?.length) return { notFound: true };
  return { props: { store: data[0] } };
};
