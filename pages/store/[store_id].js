import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import StoreItem from "../../components/customer/StoreItem";
import Layout from "../../components/layout/Layout";
import Banner from "../../components/vendor/Banner";
import { useKeenSlider } from "keen-slider/react";
import Link from "next/link";

export default function StorePage({ store }) {
  console.log(store);
  const [sliderRef] = useKeenSlider({
    mode: "free-snap",
    slides: {
      origin: "center",
      perView: 4,
      spacing: 20,
    },
  });

  return (
    <>
      <Layout title={store.name}>
        <div className="flex flex-col items-center">
          <Banner url={`banners/${store.id}`} />
          <div className="font-bold text-4xl m-auto">{store.name}</div>
          <div ref={sliderRef} className="my-2 keen-slider">
            {store.categories.map((category, index) => {
              if (!category.items.length) return;
              return (
                <Link
                  key={index}
                  href={`#${category.id}`}
                  className="text-center keen-slider__slide"
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
          <div className="bg-cream h-1 w-11/12 rounded-full" />
          <div className="flex flex-col pb-12 px-2 w-full">
            {store.categories.length ? (
              store.categories.map((category, index) => {
                if (!category.items.length) return;
                return (
                  <div key={index}>
                    <div
                      className="text-2xl my-2 font-semibold text-center"
                      id={category.id}
                    >
                      {category.name}
                    </div>
                    <div className="columns-2 gap-2">
                      {category.items.map((item, index) => (
                        <StoreItem
                          key={index}
                          vendor_id={store.id}
                          data={item}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
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
    .eq("id", ctx.params.store_id)
    .single();

  if (!data) return { notFound: true };
  return { props: { store: data } };
};
