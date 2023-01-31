import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { FaChevronLeft } from "react-icons/fa";
import StoreItem from "../components/customer/StoreItem";
import Layout from "../components/layout/Layout";

export default function FavoritesPage({ favorites }) {
  const router = useRouter();

  return (
    <>
      <Layout title="Favorites">
        <button
          type="button"
          className="absolute top-24 left-4 rounded-full py-2 pl-1.5 pr-2.5 z-20"
          onClick={() => router.back()}
        >
          <FaChevronLeft className="text-3xl text-maroon drop-shadow-lg" />
        </button>
        <p className="text-5xl font-bold text-dark text-center mt-2 my-3">
          Favorites
        </p>
        <div className="columns-2 gap-2 mx-2">
          {favorites?.map((fav, index) => (
            <StoreItem key={index} vendor_id={fav.vendor_id} data={fav} />
          ))}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data: favoriteItemsId } = await supabase
    .from("favorites")
    .select("item_id");
  const { data } = await supabase
    .from("items")
    .select(
      "id, name, base_price, description, vendor_id, available, has_image"
    )
    .in(
      "id",
      favoriteItemsId.map((item) => item.item_id)
    );
  return { props: { favorites: data } };
};
