import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import StoreItem from "../../components/customer/StoreItem";
import Layout from "../../components/layout/Layout";
import Banner from "../../components/vendor/Banner";
import { useKeenSlider } from "keen-slider/react";
import Link from "next/link";
import { useRef } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";

export default function StorePage({ store }) {
  const router = useRouter();
  const categoryRefs = useRef([]);
  const [sliderRef] = useKeenSlider({
    mode: "free-snap",
    slides: {
      origin: "center",
      perView: 4,
      spacing: 20,
    },
  });

  const scrollToElement = (index) => {
    window.scrollTo({
      top: categoryRefs.current[index].offsetTop - 80,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Layout title={store.name}>
        <button
          type="button"
          className="absolute top-28 left-4 rounded-full py-2 pl-1.5 pr-2.5 z-20 bg-cream"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon drop-shadow-lg" />
        </button>
        <div className="flex flex-col items-center">
          <Banner url={`banners/${store.id}`} />
          <div className="font-bold text-4xl m-auto">{store.name}</div>
          <div ref={sliderRef} className="my-2 keen-slider">
            {store.categories.map((category, index) => {
              if (!category.items.length) return;
              return (
                <button
                  key={index}
                  onClick={() => scrollToElement(index)}
                  className="text-center keen-slider__slide"
                >
                  {category.name}
                </button>
              );
            })}
          </div>
          <div className="bg-cream h-1 w-11/12 rounded-full" />
          <div className="flex flex-col pb-12 px-2 w-full">
            {store.categories.length &&
            store.categories.map((c) => c.items.length > 0).includes(true) ? (
              store.categories.map((category, index) => {
                if (!category.items.length) return;
                return (
                  <div
                    key={index}
                    ref={(el) => (categoryRefs.current[index] = el)}
                  >
                    <div className="text-2xl my-2 font-semibold text-center">
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
              <>
                <Image
                  src="graphics/empty.png"
                  alt="empty store"
                  width={600}
                  height={500}
                />
                <div className="text-2xl font-bold text-center">
                  the store seems empty
                </div>
                <div className="text-lg font-semibold text-center">
                  try again in another time
                </div>
              </>
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
      "id, name, open, categories (id, name, desc, items (id, name, description, base_price, available, has_image))"
    )
    .eq("id", ctx.params.store_id)
    .single();

  if (!data) return { notFound: true };
  return { props: { store: data } };
};
